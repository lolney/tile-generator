import { sampleRasterTiles, findTileMax, findTileMode } from "../db/postgis";
import { Polygon } from "geojson";
import { TilesArray } from "@tile-generator/common";

const KOPPEN_DB_NAME = "beck_kg_v1_present_0p0083";
const WATERMASK_DB_NAME = "watermask_500";
const SLOPE_DB_NAME = "slope_500";
const FOREST_DB_NAME = "forest_500";
const MARSH_DB_NAME = "marsh_500";
const FLOW_DB_NAME = "flow_500";
const PRECIPITATION_DB_NAME = "precipitation_500";

const waterThresholdByNWaterTilesNeighbors: { [a: number]: number } = {
  0: 0.2,
  1: 0.1,
  2: 0.1,
  3: 0.2,
  4: 0.3,
  5: 0.7,
  6: 0.9,
};

export async function isLandLocal(tiles: Polygon[], width: number) {
  const dbResults = await sampleRasterTiles(tiles, WATERMASK_DB_NAME, 50);
  const valuesArray = new TilesArray<number>(dbResults, width);
  const waterArray = new TilesArray<boolean>(
    dbResults.map((val) => val > 0.1),
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

export async function findClimateLocal(tiles: Polygon[]) {
  return findTileMode(tiles, KOPPEN_DB_NAME);
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

export async function precipitationLocal(tiles: Polygon[]) {
  return sampleRasterTiles(tiles, PRECIPITATION_DB_NAME, 2);
}
