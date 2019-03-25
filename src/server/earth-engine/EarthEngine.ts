// @ts-ignore: noImplicitAny
import ee from "@google/earthengine";
import privateKey from "../tile-generator-private-key.json";
import isLand from "./isLand.js";
import { TerrainType, Tile, Elevation } from "../../common/types";
import findSlope from "./findSlope.js";
import { getClimateType, getTerrainType } from "./koppen.js";

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

  createLandTiles(grid: any): Array<Tile> {
    const featureCollection = isLand(grid);

    // get "too many concurrent aggregations" on this
    const local = featureCollection.getInfo();

    return local.features.map((feature: any) => {
      const island = feature.properties.isLand;
      return {
        terrain: island ? TerrainType.grassland : TerrainType.coast
      };
    });
  }

  createElevationTiles(grid: any): Array<Tile> {
    const featureCollection = findSlope(grid);

    const local = featureCollection.getInfo();

    return local.features.map((feature: any) => {
      const meanSlope = feature.properties.mean;
      let elevation;

      if (meanSlope === undefined || meanSlope < 4) {
        elevation = Elevation.flat;
      } else if (meanSlope < 10) {
        elevation = Elevation.hill;
      } else {
        elevation = Elevation.mountain;
      }

      return { elevation };
    });
  }

  createClimateTiles(grid: any): Promise<Array<Tile>> {
    const local = grid.getInfo();

    return Promise.all(
      local.features.map(async (feature: any) => {
        const [lng, lat] = feature.geometry.coordinates[0][0];
        const koppen = await getClimateType(lng, lat);
        const terrain = getTerrainType(koppen);
        return { terrain };
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
        
 */
