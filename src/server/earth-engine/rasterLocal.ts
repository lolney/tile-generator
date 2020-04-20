import { sampleRasterTiles, findTileMax } from "../db/postgis";
import { Polygon } from "geojson";
import { IS_WATER_IF_GREATER_THAN } from "./isLand";
import { TilesArray } from "../../common/TilesArray";

const WATERMASK_DB_NAME = "watermask_500";
const SLOPE_DB_NAME = "slope_500";
const FOREST_DB_NAME = "forest_500";
const MARSH_DB_NAME = "marsh_500";
const FLOW_DB_NAME = "flow_500";

const waterThresholdByNWaterTilesNeighbors: { [a: number]: number } = {
  0: 0.05,
  1: 0.1,
  2: 0.2,
  3: 0.3,
  4: 0.5,
  5: 0.8,
  6: 0.9,
};

export async function isLandLocal(tiles: Polygon[], width: number) {
  const dbResults = await sampleRasterTiles(tiles, WATERMASK_DB_NAME);
  const valuesArray = new TilesArray<number>(dbResults, width);
  const waterArray = new TilesArray<boolean>(
    dbResults.map((val) => val > IS_WATER_IF_GREATER_THAN),
    width
  );

  return Array.from(waterArray.pairs(), ([row, col]) => {
    const val = valuesArray.get(row, col);
    const waterNeighborCount = Array.from(
      waterArray.neighbors(row, col)
    ).filter(([ii, jj]) => waterArray.get(ii, jj)).length;
    const threshold = waterThresholdByNWaterTilesNeighbors[waterNeighborCount];
    return val < threshold;
  });
}

export async function findSlopeLocal(tiles: Polygon[]) {
  return sampleRasterTiles(tiles, SLOPE_DB_NAME);
}

export async function isMarshLocal(tiles: Polygon[]) {
  return sampleRasterTiles(tiles, MARSH_DB_NAME);
}

export async function isForestLocal(tiles: Polygon[]) {
  return sampleRasterTiles(tiles, FOREST_DB_NAME);
}

export async function isRiverLocal(tiles: Polygon[]) {
  return findTileMax(tiles, FLOW_DB_NAME);
}
