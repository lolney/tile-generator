import {
  sampleRasterTiles,
  findTileMax,
  findTileMode,
  findTileStddev,
} from "../db/postgis";
import { Polygon } from "geojson";
import { TilesArray } from "@tile-generator/common";
import { WaterParams, LayerWeightParams } from "./LayerWeightParams";

const ELEVATION_DB_NAME = "elevation_500";
const FLOW_DB_NAME = "flow_500";
const FOREST_DB_NAME = "forest_500";
const KOPPEN_DB_NAME = "beck_kg_v1_present_0p0083";
const LANDCOVER_DB_NAME = "landcover_500";
const MARSH_DB_NAME = "marsh_500";
const PRECIPITATION_DB_NAME = "precipitation_500";
const SLOPE_DB_NAME = "slope_500";
const WATERMASK_DB_NAME = "watermask_500";

export async function isLandLocal(
  tiles: Polygon[],
  width: number,
  params: LayerWeightParams
) {
  const dbResults = await sampleRasterTiles(tiles, WATERMASK_DB_NAME, 50);
  const valuesArray = new TilesArray<number>(dbResults, width);
  const waterArray = new TilesArray<boolean>(
    dbResults.map((val) => val > 0.5),
    width
  );

  return Array.from(waterArray.pairs(), ([row, col]) => {
    const val = valuesArray.get(row, col);
    const waterNeighborCount = Array.from(
      waterArray.neighbors(row, col)
    ).filter(([ii, jj]) => waterArray.get(ii, jj)).length;
    const threshold = WaterParams.waterThreshold(params, waterNeighborCount);
    return val < threshold;
  });
}

export async function findSlopeLocal(tiles: Polygon[]) {
  return sampleRasterTiles(tiles, SLOPE_DB_NAME);
}

export async function findElevationLocal(tiles: Polygon[]) {
  return findTileStddev(tiles, ELEVATION_DB_NAME);
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

export async function landcoverLocal(tiles: Polygon[]) {
  return findTileMode(tiles, LANDCOVER_DB_NAME);
}

export async function precipitationLocal(tiles: Polygon[]) {
  return sampleRasterTiles(tiles, PRECIPITATION_DB_NAME, 2);
}
