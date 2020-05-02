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
 * Note: can use ST_SummaryStatsAgg for this as in `findMax`,
 * but perfroms significantly worse
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
    WHERE values.value != double precision 'NaN';
  `;

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
    WHERE values.value != double precision 'NaN';
  `;

  const rows = await db.doQuery(query);
  const value = rows[0]["mode"];

  return value;
}

export async function findMax(table: string, tiles: Polygon[]) {
  let query = `
    SELECT temp_geoms.id, (ST_SummaryStatsAgg(ST_Clip(raster.rast,temp_geoms.geom), 1, false, 0.05)).max
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
