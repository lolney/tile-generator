import { sampleRasterTiles } from "../db/postgis";
import { Polygon } from "geojson";
import { IS_WATER_IF_GREATER_THAN } from "./isLand";

const WATERMASK_DB_NAME = "watermask_500";
const SLOPE_DB_NAME = "slope_500";
const FOREST_DB_NAME = "forest_500";
const MARSH_DB_NAME = "marsh_500";

export async function isLandLocal(tiles: Polygon[]) {
  const dbResults = await sampleRasterTiles(tiles, WATERMASK_DB_NAME);

  return dbResults.map((val: number) => val < IS_WATER_IF_GREATER_THAN);
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
