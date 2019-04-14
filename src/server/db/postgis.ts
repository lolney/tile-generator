import { Polygon, GeoJsonObject } from "geojson";
import db from ".";
import { SAMPLES_PER_TILE } from "../constants";
import { fstat } from "fs";

export function serializeGeoJSON(geom: GeoJsonObject): string {
  const taggedBounds = {
    ...geom,
    crs: { type: "name", properties: { name: "EPSG:4326" } }
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

export async function sampleRasterTiles(tiles: Polygon[], dbname: string) {
  return Promise.all(
    tiles.map(async geom => await sampleRaster(dbname, geom, SAMPLES_PER_TILE))
  );
}
