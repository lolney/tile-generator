import { Polygon } from "geojson";
import * as turf from "@turf/turf";
import { LatLngBounds } from "leaflet";
import zip from "lodash/zip";
import {
  Elevation,
  FeatureType,
  Koppen,
  LatLngBounds as LatLngBoundsT,
  MapLayers,
  Options,
  TerrainType,
  Tile,
  TilesArray,
} from "@tile-generator/common";
import { getForestType, getTerrainType } from "../rasters/koppen";
import generateRivers from "../rasters/generateRivers";
import {
  isLandLocal,
  findSlopeLocal,
  isMarshLocal,
  isForestLocal,
  findClimateLocal,
  landcoverLocal,
  findElevationLocal,
} from "../rasters/rasterLocal";
import { LC_Type1 } from "../types/rasters";
import Map from "./Map";
import { logperformance } from "../logging";
import { resampleMissing } from "../rasters/resampleMissing";

export default class MapBuilder {
  grid: Polygon[];
  originalGrid: Polygon[];
  bounds: LatLngBounds;
  options: Options;
  waterLayer: Tile[] | undefined;
  climateTypes: Koppen[] | undefined;

  constructor(grid: Polygon[], bounds: LatLngBounds, options: Options) {
    this.originalGrid = grid;
    this.grid = MapBuilder.wrapLongitude(grid);
    this.bounds = bounds;
    this.options = options;
  }

  static wrapLongitude = (grid: Polygon[]): Polygon[] =>
    grid.map((poly) => ({
      ...poly,
      coordinates: [
        poly.coordinates[0].map(([lng, lat]) => [MapBuilder.wrapLng(lng), lat]),
      ],
    }));

  static wrapLng = (lng: number) => {
    if (lng < -180) return 180 + ((lng + 180) % 360);
    if (lng > 180) return ((lng - 180) % 360) - 180;
    return lng;
  };

  static deserializeBounds(bounds: LatLngBoundsT): LatLngBounds {
    return new LatLngBounds(
      [bounds._southWest.lat, bounds._southWest.lng],
      [bounds._northEast.lat, bounds._northEast.lng]
    );
  }

  getEnvelope(): string {
    return `
      ST_MakeEnvelope(
        ${this.bounds.getWest()}, ${this.bounds.getSouth()},
        ${this.bounds.getEast()}, ${this.bounds.getNorth()},
        4326
      )
    `;
  }

  getDiameter = () => {
    const ls = turf.lineString([
      [this.bounds.getWest(), this.bounds.getNorth()],
      [this.bounds.getEast(), this.bounds.getSouth()],
    ]);
    return turf.length(ls, { units: "miles" });
  };

  async getClimateTypes() {
    if (!this.climateTypes)
      this.climateTypes = await findClimateLocal(this.grid);
    return this.climateTypes;
  }

  landcoverMountainSlopeThreshold = (landcover: number) => {
    switch (landcover) {
      case LC_Type1.Snow:
        return 5;
      case LC_Type1.Barren:
      case LC_Type1.Grasslands:
      case LC_Type1.Savannas:
      case LC_Type1.WoodySavannas:
      case LC_Type1.OpenShrublands:
        return 10;
      default:
        return 13;
    }
  };

  createLayer = logperformance(
    async (layer: MapLayers): Promise<Tile[]> => {
      switch (layer) {
        case MapLayers.climate:
          this.waterLayer = await this.createLandTiles();
          const climateLayer = await this.createClimateTiles();
          const merged = Map.mergeTileArrays(this.waterLayer, climateLayer);
          return Map.remapCoastTiles(
            new TilesArray(merged, this.options.dimensions.width)
          );
        case MapLayers.elevation:
          return this.createElevationTiles();
        case MapLayers.forest:
          return this.createForestTiles();
        case MapLayers.rivers:
          if (!this.waterLayer)
            throw new Error(
              "Water layer must be generated before the river layer"
            );
          return this.createRiverTiles(this.waterLayer);
        case MapLayers.marsh:
          return this.createMarshTiles();
      }
    }
  );

  async createLandTiles(): Promise<Array<Tile>> {
    const results = await isLandLocal(this.grid, this.options.dimensions.width);

    return results.map((isLand: boolean) => ({
      terrain: isLand ? TerrainType.grass : TerrainType.coast,
    }));
  }

  async createElevationTiles(): Promise<Array<Tile>> {
    const stdToSlopeFactor = 40;

    const results = await findSlopeLocal(this.grid);
    const slope = await resampleMissing(this.grid, results, () =>
      findElevationLocal(this.grid).then((elevation: number[]) =>
        elevation.map((e) => e / stdToSlopeFactor)
      )
    );
    const landcover = await landcoverLocal(this.grid);

    return zip(slope, landcover).map(([meanSlope, landcover]) => {
      const mountainThreshold = this.landcoverMountainSlopeThreshold(landcover);
      let elevation;

      if (!meanSlope || meanSlope < 4) {
        elevation = Elevation.flat;
      } else if (meanSlope < mountainThreshold) {
        elevation = Elevation.hills;
      } else {
        elevation = Elevation.mountain;
      }

      return { elevation };
    });
  }

  async createForestTiles(): Promise<Array<Tile>> {
    const FOREST_THRESHOLD = 0.75;
    const results = await isForestLocal(this.grid);

    const tilePromises = results.map(async (forestIndex, i) => {
      const isForest = forestIndex && forestIndex < FOREST_THRESHOLD + 1; // 1: forest; 2: non-forest

      if (!isForest) return {};

      const koppen = (await this.getClimateTypes())[i];

      if (!koppen) return {};

      const feature = getForestType(koppen);

      return { feature };
    });

    return Promise.all(tilePromises);
  }

  async createMarshTiles(): Promise<Array<Tile>> {
    const MARSH_THRESHOLD = 0.25;
    const results = await isMarshLocal(this.grid);

    return results.map((mean: number) => {
      const isMarsh = mean > MARSH_THRESHOLD; // 1: marsh; 0: non-marsh

      if (!isMarsh) return {};
      return { feature: FeatureType.marsh };
    });
  }

  async createClimateTiles(): Promise<Array<Tile>> {
    return (await this.getClimateTypes()).map((koppen) => ({
      terrain: getTerrainType(koppen),
    }));
  }

  async createRiverTiles(waterTiles: Tile[]): Promise<Tile[]> {
    const dimensions = this.options.dimensions;
    const groups = await generateRivers(this.grid, dimensions, waterTiles);
    const initialValue = Array(this.grid.length).fill({});

    return groups.reduce(
      (tiles, group) =>
        zip(tiles, group).map(([tile, newTile]) => ({ ...tile, ...newTile })),
      initialValue
    );
  }
}
