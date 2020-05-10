import L, { LatLngTuple } from "leaflet";
import { createRawHexGrid } from "@tile-generator/common";
import { Dimensions, Tile } from "@tile-generator/common";
import { LineString, Polygon } from "geojson";

export const createPreviewGrid = (
  bounds: L.LatLngBounds,
  dimensions: Dimensions
) => {
  const { width, height } = dimensions;
  return createRawHexGrid({
    width,
    height,
    lon_start: bounds.getWest(),
    lon_end: bounds.getEast(),
    lat_start: bounds.getNorth(),
    lat_end: bounds.getSouth(),
  });
};

export const drawLayer = (
  grid: Polygon[],
  layer: Tile[],
  style: L.StyleFunction
) =>
  L.geoJSON(
    {
      type: "FeatureCollection",
      // @ts-ignore
      features: grid.map((hex, i) => ({
        geometry: hex,
        properties: layer[i],
        type: "Feature",
      })),
    },
    { style }
  );

export const drawGrid = (grid: Polygon[], style: L.StyleFunction) =>
  L.polygon(
    grid.map((poly) =>
      poly.coordinates[0].map(([lng, lat]) => [lat, lng] as LatLngTuple)
    ),
    { ...style() }
  );

export const drawRivers = (riverLines: LineString[]) =>
  L.geoJSON(
    {
      type: "GeometryCollection",
      // @ts-ignore
      features: riverLines,
    },
    {
      style: () => ({
        color: "blue",
        opacity: 0.5,
      }),
    }
  );
