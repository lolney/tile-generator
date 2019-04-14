import { sampleRasterTiles } from "../db/postgis";
import { Polygon } from "geojson";
import { IS_WATER_IF_GREATER_THAN } from "./isLand";

const WATERMASK_DB_NAME = "watermask_500";
const SLOPE_DB_NAME = "slope_500";

export async function isLandLocal(tiles: Polygon[]) {
  const dbResults = await sampleRasterTiles(tiles, WATERMASK_DB_NAME);

  return dbResults.map((val: number) => val < IS_WATER_IF_GREATER_THAN);
}

export async function findSlopeLocal(tiles: Polygon[]) {
  const dbResults = await sampleRasterTiles(tiles, SLOPE_DB_NAME);

  return dbResults;
}
