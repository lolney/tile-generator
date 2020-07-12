import { isEmpty, groupBy, throttle } from "lodash";
import L, { LatLngTuple } from "leaflet";
import { createRawHexGrid, TileUtils } from "@tile-generator/common";
import { Dimensions, Tile } from "@tile-generator/common";
import { LineString, Polygon, Feature, GeoJsonObject } from "geojson";
import styles from "./styles.module.css";

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

export const drawLayer = (grid: Polygon[], tile: Tile) => {
  const poly: Polygon = {
    type: "Polygon",
    coordinates: grid.map((poly) => poly.coordinates[0]),
  };
  const feature: Feature = {
    type: "Feature",
    geometry: poly,
    // @ts-ignore
    feature: tile,
  };
  return feature;
};

/**
 * Create a separate
 * @param grid
 * @param layer
 * @param style
 */
export const drawLayerComponents = (
  grid: Polygon[],
  layer: Tile[],
  style: L.StyleFunction
) => {
  const getValue = (tile: Tile) =>
    (Object.values(tile) as Array<[keyof Tile, Tile[keyof Tile]]>)
      .filter((value) => value !== undefined)
      .map((value) => (value instanceof Object ? "true" : value))
      .join(",");

  const uniqueValues = groupBy(
    layer.map((tile, index) => ({ tile, index })),
    ({ tile }) => getValue(tile)
  );

  const features = Object.values(uniqueValues).map((tiles) => {
    const polys = tiles.map(({ index }) => grid[index]);
    const [{ tile }] = tiles;
    return drawLayer(polys, tile);
  });

  if (isEmpty(features) && !isEmpty(grid)) features.push(drawLayer(grid, {}));

  return L.geoJSON(
    {
      type: "FeatureCollection",
      features,
    } as GeoJsonObject,
    {
      style,
    }
  );
};

export const createTooltip = (layer: L.Layer) => {
  const tile = ((layer as L.FeatureGroup)?.feature as any)?.feature as
    | Tile
    | undefined;
  if (!tile) return "None";

  const displayValues = (Object.entries(tile) as Array<
    [keyof Tile, Tile[keyof Tile]]
  >)
    .filter(([_, value]) => value !== undefined)
    .map(([key, value]) => TileUtils.displayValue(key, value!));

  return displayValues.length ? displayValues[0] : "None";
};

var customOptions = {
  closeButton: false,
  minWidth: 15,
  textAlign: "center",
};

export const bindTooltip = (map: L.Map) => (layer: L.Layer) => {
  const popup = L.popup();
  popup.setContent(createTooltip(layer));
  layer.bindPopup(popup, customOptions);

  let popupOpen = false;
  let closeTimeout: ReturnType<typeof setTimeout> | null;

  layer.on("mouseover", (e: L.LeafletMouseEvent) => {
    if (closeTimeout) {
      clearTimeout(closeTimeout);
      closeTimeout = null;
    }

    popupOpen = true;
    const popup = e.target.getPopup();
    popup.setLatLng(e.latlng).openOn(map);
  });

  layer.on(
    "mousemove",
    throttle((e: L.LeafletMouseEvent) => {
      const popup = e.target.getPopup();
      popup.setLatLng(e.latlng).openOn(map);
    }, 100)
  );

  layer.on("mouseout", (e: L.LeafletMouseEvent) => {
    if (popupOpen && !closeTimeout)
      closeTimeout = setTimeout(() => {
        closeTimeout = null;
        popupOpen = false;
        e.target.closePopup();
      }, 1000);
  });
};

export const drawGrid = (grid: Polygon[], style: L.StyleFunction) =>
  L.polygon(
    grid.map((poly) =>
      poly.coordinates[0].map(([lng, lat]) => [lat, lng] as LatLngTuple)
    ),
    { ...style() }
  );

export const drawRivers = (riverLines: LineString[], zoomLevel: number) =>
  L.geoJSON(
    {
      type: "GeometryCollection",
      features: riverLines,
    } as GeoJsonObject,
    {
      style: () => ({
        color: "blue",
        opacity: 1,
        weight: 0.75 * zoomLevel,
      }),
    }
  );
