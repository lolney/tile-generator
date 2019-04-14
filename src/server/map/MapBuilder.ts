import { Polygon } from "geojson";
import createHexGrid from "../earth-engine/createHexGrid";
// @ts-ignore
import { LatLngBounds } from "leaflet-headless";
import {
  Tile,
  TerrainType,
  Elevation,
  LatLngBounds as LatLngBoundsT,
  MapLayers,
  FeatureType
} from "../../common/types";
import isForest from "../earth-engine/isForest";
import {
  getForestType,
  getClimateType,
  getTerrainType
} from "../earth-engine/koppen";
import isLand from "../earth-engine/isLand";
import findSlope from "../earth-engine/findSlope";
import createRiverTiles from "../earth-engine/rivers";
import isMarsh from "../earth-engine/isMarsh";
import { isLandLocal, findSlopeLocal } from "../earth-engine/rasterLocal";

export default class MapBuilder {
  grid: Polygon[];
  bounds: LatLngBounds;

  constructor(grid: Polygon[], bounds: LatLngBounds) {
    this.grid = grid;
    this.bounds = bounds;
  }

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

  async createLayer(layer: MapLayers): Promise<Tile[]> {
    switch (layer) {
      case MapLayers.climate:
        return this.createClimateTiles();
      case MapLayers.elevation:
        return this.createElevationTiles();
      case MapLayers.forest:
        return this.createForestTiles();
      case MapLayers.land:
        return this.createLandTiles();
      case MapLayers.rivers:
        return this.createRiverTiles();
      case MapLayers.marsh:
        return this.createMarshTiles();
    }
  }

  async createLandTiles(): Promise<Array<Tile>> {
    const results = await isLandLocal(this.grid);

    return results.map((isLand: boolean) => ({
      terrain: isLand ? TerrainType.grass : TerrainType.coast
    }));
  }

  async createElevationTiles(): Promise<Array<Tile>> {
    const results = await findSlopeLocal(this.grid);

    return results.map((meanSlope: number | undefined) => {
      let elevation;

      if (!meanSlope || meanSlope < 4) {
        elevation = Elevation.flat;
      } else if (meanSlope < 10) {
        elevation = Elevation.hills;
      } else {
        elevation = Elevation.mountain;
      }

      return { elevation };
    });
  }

  async createForestTiles() {
    const FOREST_THRESHOLD = 0.75;
    const process = async (properties: any, geometry: Polygon) => {
      const index = properties.mean;
      const isForest = index < FOREST_THRESHOLD + 1; // 1: forest; 2: non-forest

      if (!isForest) return {};

      const koppen = await getClimateType(geometry);

      if (!koppen) return {};

      const feature = getForestType(koppen);

      return { feature };
    };

    return Promise.all(this.createEETiles(isForest, process));
  }

  async createMarshTiles(): Promise<Array<Tile>> {
    const MARSH_THRESHOLD = 0.25;

    const process = async (properties: any, geometry: Polygon) => {
      const mean = properties.mean;
      const isMarsh = mean > MARSH_THRESHOLD; // 1: forest; 2: non-forest

      if (!isMarsh) return {};
      return { feature: FeatureType.marsh };
    };

    return Promise.all(this.createEETiles(isMarsh, process));
  }

  createEETiles(
    analysis: Function,
    process: (properties: any, geometry: Polygon) => Promise<Tile> | Tile
  ) {
    const earthGrid = createHexGrid(this.grid);
    const featureCollection = analysis(earthGrid);

    // Note: with large tile sizes, there's a problem with this stage
    // Can try first exporting to drive, then loading from there
    // Or, actually seems to be a problem with sending too much?
    const local = featureCollection.getInfo();

    return local.features.map((feature: any) => {
      return process(feature.properties, feature.geometry);
    });

    /* need cloud storage
        ee.batch.Export.table.toAsset(featureCollection);
        return [{}];
        */
  }

  createClimateTiles(): Promise<Array<Tile>> {
    return Promise.all(
      this.grid.map(async (geometry: Polygon) => {
        const koppen = await getClimateType(geometry);

        if (koppen === undefined) return {};
        else {
          const terrain = getTerrainType(koppen);
          return { terrain };
        }
      })
    );
  }

  async createRiverTiles(): Promise<Tile[]> {
    const indexedTiles = await createRiverTiles(this.getEnvelope(), this.grid);

    const tiles = this.grid.map((_, i) => ({}));

    for (const tile of indexedTiles) {
      tiles[tile.id] = tile.tile;
    }

    return tiles;
  }
}
