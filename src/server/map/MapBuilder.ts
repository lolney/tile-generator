import { Polygon } from "geojson";
import createHexGrid from "../earth-engine/createHexGrid";
// @ts-ignore
import { LatLngBounds } from "leaflet-headless";
import {
  Tile,
  TerrainType,
  Elevation,
  LatLngBounds as LatLngBoundsT
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

  async createLandTiles(): Promise<Array<Tile>> {
    const process = (properties: any) => {
      const island = properties.isLand;
      return {
        terrain: island ? TerrainType.grass : TerrainType.coast
      };
    };

    return this.createEETiles(isLand, process);
  }

  async createElevationTiles(): Promise<Array<Tile>> {
    const process = (properties: any) => {
      const meanSlope = properties.mean;
      let elevation;

      if (meanSlope === undefined || meanSlope < 4) {
        elevation = Elevation.flat;
      } else if (meanSlope < 10) {
        elevation = Elevation.hills;
      } else {
        elevation = Elevation.mountain;
      }

      return { elevation };
    };

    return this.createEETiles(findSlope, process);
  }

  createForestTiles() {
    const process = async (properties: any, geometry: Polygon) => {
      const index = properties.mean;
      const isForest = index < 1.75; // 1: forest; 2: non-forest

      if (!isForest) return {};

      const [lng, lat] = geometry.coordinates[0][0];
      const koppen = await getClimateType(lng, lat);

      if (!koppen) return {};

      const feature = getForestType(koppen);

      return { feature };
    };

    return Promise.all(this.createEETiles(isForest, process));
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
        const [lng, lat] = geometry.coordinates[0][0];
        const koppen = await getClimateType(lng, lat);

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
