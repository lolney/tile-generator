import { Polygon, GeoJsonObject } from "geojson";

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
