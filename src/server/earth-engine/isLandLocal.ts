import { sampleRaster } from "../db/postgis";
import { Polygon } from "geojson";
import { SAMPLES_PER_TILE } from "../constants";
import { IS_WATER_IF_GREATER_THAN } from "./isLand";

const WATERMASK_DB_NAME = "watermask_500";

export default async function isLandLocal(tiles: Polygon[]) {
  const dbResults = await Promise.all(
    tiles.map(
      async geom =>
        await sampleRaster(WATERMASK_DB_NAME, geom, SAMPLES_PER_TILE)
    )
  );

  return dbResults.map((val: number) => val < IS_WATER_IF_GREATER_THAN);
}
