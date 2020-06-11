import { Polygon, GeoJsonObject } from "geojson";
import db from ".";
import { SAMPLES_PER_TILE } from "../constants";

export function serializeGeoJSON(geom: GeoJsonObject): string {
  const taggedBounds = {
    ...geom,
    crs: { type: "name", properties: { name: "EPSG:4326" } },
  };
  const bounds = `ST_GeomFromGeoJSON('${JSON.stringify(taggedBounds)}')`;
  return bounds;
}

export function sampleRows(geom: Polygon, n: number) {
  return `
    SELECT (ST_Dump(ST_GeneratePoints(
        ${serializeGeoJSON(geom)}, ${n}))).geom
    `;
}

export function sampleSingleGeom(geom: Polygon, n: number) {
  return `
    SELECT ST_GeneratePoints(
        ${serializeGeoJSON(geom)}, ${n}) as geom
    `;
}

export function createTempTable() {
  return `
  CREATE TEMPORARY TABLE IF NOT EXISTS temp_geoms 
  (
    id integer,
    geom geometry(Polygon,4326)
  );
  `;
}

const generateInsert = (tiles: Polygon[]) => {
  const begin = `INSERT INTO temp_geoms(id, geom) VALUES`;
  const end = ";";
  const middle = tiles
    .map(
      (tile, i) => `(
    ${i + 1},
    ${serializeGeoJSON(tile)}
  )`
    )
    .join(",");
  return begin + middle + end;
};

/**
 * Notes on optimizing this:
 * - An index like CREATE INDEX srtm_tiled_rast_gist_idx ON forest_500 USING GIST (ST_ConvexHull(rast)); doesn't make much difference
 * - Using ST_SummaryStatsAgg dramatically slows things down
 * - Nonetheless, EXPLAIN ANALYZE shows a nested loop with 27000 rows
 * - Combining this into a single query is hard (how do you group sampled points by hex???)
 */
export async function sampleRaster(table: string, geom: Polygon, n: number) {
  const points = sampleRows(geom, n);
  const query = `
    SELECT AVG(values.value) as avg 
    FROM (
      SELECT ST_Value(raster.rast, points.geom) As value
      FROM (${points}) AS points, ${table} AS raster
      WHERE ST_Intersects(raster.rast, points.geom)
    ) as values 
    WHERE values.value != double precision 'NaN';  `;

  const rows = await db.doQuery(query);
  const value = rows[0]["avg"];

  return value;
}

export async function findMode(table: string, geom: Polygon, n: number) {
  const points = sampleRows(geom, n);
  const query = `
    SELECT MODE() WITHIN GROUP (ORDER BY CAST(values.value AS INTEGER)) AS mode 
    FROM (
      SELECT ST_Value(raster.rast, points.geom) As value
      FROM (${points}) AS points, ${table} AS raster
      WHERE ST_Intersects(raster.rast, points.geom)
    ) as values 
    WHERE values.value != double precision 'NaN' AND values.value != 0;
    `;

  const rows = await db.doQuery(query);
  const value = rows[0]["mode"];

  return value;
}

/**
 * Notes on performance:
 * - Vast majority of time is spent on the HashAggregate stage
 * - There's a nested loop that uses an index scan on the raster
 * - Surprisingly, changing the sample percent (last arg) doesn't have a noticeable effect
 * - Removing the ST_CLIP while keeping the sample percent low actually can improve performance by about 2x,
 * but this makes rivers pretty inaccurate (presumably because it's selecting raster tiles that are much bigger than the polys?)
 * - Decreasing tile size to 80x80 does seem to improve performance somewhat, but not noticeably
 */
export async function findMax(table: string, tiles: Polygon[]) {
  let query = `
    SELECT temp_geoms.id, (ST_SummaryStatsAgg(ST_Clip(raster.rast,temp_geoms.geom), 1, true, 0.5)).max
    FROM temp_geoms, ${table} AS raster
    WHERE ST_Intersects(raster.rast, temp_geoms.geom)
    GROUP BY temp_geoms.id
    ORDER BY temp_geoms.id;
  `;

  query = [createTempTable(), generateInsert(tiles), query].join("\n");

  const rows = await db.doQuery(query);
  const value = rows.map((row: any) => row.max);

  return value;
}

export async function sampleRasterTiles(
  tiles: Polygon[],
  dbname: string,
  samples = SAMPLES_PER_TILE
) {
  return Promise.all(
    tiles.map(async (geom) => await sampleRaster(dbname, geom, samples))
  );
}

export async function findTileMode(
  tiles: Polygon[],
  dbname: string,
  samples = SAMPLES_PER_TILE
) {
  return Promise.all(
    tiles.map(async (geom) => await findMode(dbname, geom, samples))
  );
}

export async function findTileMax(tiles: Polygon[], dbname: string) {
  return findMax(dbname, tiles);
}
