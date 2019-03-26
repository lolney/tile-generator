// @ts-ignore: noImplicitAny
import ee from "@google/earthengine";
import privateKey from "../tile-generator-private-key.json";
import isLand from "./isLand.js";
import { TerrainType, Tile, Elevation, FeatureType } from "../../common/types";
import findSlope from "./findSlope.js";
import { getClimateType, getTerrainType, getForestType } from "./koppen.js";
import { Polygon, GeoJsonObject } from "geojson";
import isForest from "./isForest.js";
import createHexGrid from "./createHexGrid.js";

export default class EarthEngine {
  static async init() {
    await new Promise((resolve, reject) => {
      ee.data.authenticateViaPrivateKey(
        privateKey,
        () => {
          console.log("auth succeeded");
          resolve();
        },
        function(e: Error) {
          reject(e);
        }
      );
    });

    await new Promise((resolve, reject) => {
      ee.initialize(
        null,
        null,
        () => {
          resolve();
        },
        (e: Error) => {
          reject(e);
        }
      );
    });

    return new EarthEngine();
  }

  extractGeometry(grid: any) {
    // this causes problems with maps larger than about 10x10
    const featureCollection = grid.getInfo();

    return featureCollection.features.map((feature: any) => {
      return feature.geometry;
    });
  }

  createLandTiles(grid: Array<Polygon>): Array<Tile> {
    const process = (properties: any) => {
      const island = properties.isLand;
      return {
        terrain: island ? TerrainType.grassland : TerrainType.coast
      };
    };

    return this.createEETiles(grid, isLand, process);
  }

  createElevationTiles(grid: Array<Polygon>): Array<Tile> {
    const process = (properties: any) => {
      const meanSlope = properties.mean;
      let elevation;

      if (meanSlope === undefined || meanSlope < 4) {
        elevation = Elevation.flat;
      } else if (meanSlope < 10) {
        elevation = Elevation.hill;
      } else {
        elevation = Elevation.mountain;
      }

      return { elevation };
    };

    return this.createEETiles(grid, findSlope, process);
  }

  createForestTiles(grid: Array<Polygon>) {
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

    return Promise.all(this.createEETiles(grid, isForest, process));
  }

  createEETiles(
    grid: any,
    analysis: Function,
    process: (properties: any, geometry: Polygon) => Promise<Tile> | Tile
  ) {
    const earthGrid = createHexGrid(grid);
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

  /*createClimateTiles(grid: any): Promise<Array<Tile>> {
    const local = grid.getInfo();

    return Promise.all(
      local.features.map(async (feature: any) => {
        const [lng, lat] = feature.geometry.coordinates[0][0];
        const koppen = await getClimateType(lng, lat);
        const terrain = getTerrainType(koppen);
        return { terrain };
      })
    );
  }*/

  createClimateTiles(grid: Array<Polygon>): Promise<Array<Tile>> {
    return Promise.all(
      grid.map(async (geometry: Polygon) => {
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
}

/**
 Class design:
 - Open request
    - Validate request
    - State: Map, request
    - Start jobs, notifying client on completion
    - When all jobs complete, generate the actual map
 - Earth engine (singleton)
    - sets up earth engine
    - dispatches to isLand, etc.
OPTION 1
 - Map
    - Creates grid from request dimensions and bounds
    - Holds completed map layers
    - State: layers, grid
 - Map layer
    - Contains a tile grid    
    - Eg, water: each tile is water or not 
END OPTION 1
OPTION 2
 - Map
    - Holds array of tiles
    - Can add layers - partially complete tiles
    - State: tiles, grid
END OPTION 2
 - TileMap
    - Civ5Map, Civ6Map, etc., are more specific versions
    - Has methods to write specific features


 - Mapping tiles to tilemaps:
    - Create base map by nxm tiles
    - Order applied shouldn't matter:
        - Each tile is just a collection of independent features
    - Rely on implementations of methods under the TileMap interface:
        - eg, writeLand(terrainType)
 - Writing Civ5 Maps
    - Description of map format: 
    https://forums.civfanatics.com/threads/civ5map-file-format.418566/
    - A Javascript parser (for replays, so does more):
    https://github.com/aiwebb/civ5replay/blob/gh-pages/js/Replay.js#L135
    - A Civ 6 save parser:
    https://github.com/pydt/civ6-save-parser/blob/master/index.js
        
 */
