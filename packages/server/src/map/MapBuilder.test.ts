import { createRawHexGrid, params } from "@tile-generator/common";
import { LatLngBounds } from "leaflet";
import { FeatureType, Options } from "@tile-generator/common";
import { Polygon } from "geojson";
import MapBuilder from "./MapBuilder";
import { LayerWeightParams } from "../rasters/LayerWeightParams";

import { toBeDeepCloseTo, toMatchCloseTo } from "jest-matcher-deep-close-to";
expect.extend({ toBeDeepCloseTo, toMatchCloseTo });

const polygon: Polygon = {
  type: "Polygon",
  coordinates: [
    [
      [-124.15564400809153, 41.005732995449414],
      [-124.14586748395648, 41.01042614430948],
      [-124.13609095982143, 41.005732995449414],
      [-124.13609095982143, 40.99634669772929],
      [-124.14586748395648, 40.99165354886923],
      [-124.15564400809153, 40.99634669772929],
      [-124.15564400809153, 41.005732995449414],
    ],
  ],
};

function createFromGridConfig(params: params) {
  const height =
    (params.height / params.width) * (params.lon_end - params.lon_start);
  const bounds = new LatLngBounds(
    [params.lat_start - height, params.lon_start],
    [params.lat_start, params.lon_end]
  );

  const options: Options = {
    dimensions: { width: params.height, height },
    format: "Civ V",
  };

  const grid = createRawHexGrid(params);

  return new MapBuilder(grid, bounds, options);
}

describe("MapBuilder", () => {
  it("deserializeBounds", () => {
    const bounds = {
      _southWest: { lat: 42.343320316410804, lng: -71.0863494873047 },
      _northEast: { lat: 42.38086519582323, lng: -71.03004455566408 },
    };
    const deserialized: LatLngBounds = MapBuilder.deserializeBounds(bounds);

    expect(bounds._northEast.lng).toEqual(deserialized.getEast());
    expect(bounds._northEast.lat).toEqual(deserialized.getNorth());
    expect(bounds._southWest.lng).toEqual(deserialized.getWest());
    expect(bounds._southWest.lat).toEqual(deserialized.getSouth());
  });

  it.each([0, 360, -360, -720, 720])(
    "should create grid with offset %p that's the same as the original",
    (offset) => {
      const polys: Polygon[] = [
        {
          ...polygon,
          coordinates: [
            polygon.coordinates[0].map(([lng, lat]) => [lng + offset, lat]),
          ],
        },
      ];
      const options: Options = {
        dimensions: { width: 100, height: 1000 },
        format: "Civ V",
      };

      const bounds = new LatLngBounds([36, 98], [34, 100]);
      const builder = new MapBuilder(polys, bounds, options);

      expect(builder.grid).toBeDeepCloseTo([polygon]);
      expect(builder.originalGrid).toEqual(polys);
    }
  );

  describe("createMarshTiles", () => {
    /* Mississippi delta */
    const marshed = createFromGridConfig({
      width: 1,
      height: 1,
      lon_start: -90.1,
      lon_end: -89.7,
      lat_start: 29.7,
      lat_end: 29.3,
    });
    marshed.layerWeights = new LayerWeightParams({ marsh: 1 });

    /* Western great plains */
    const nonMarshed = createFromGridConfig({
      width: 10,
      height: 10,
      lon_start: -110,
      lon_end: -100,
      lat_start: 40,
      lat_end: 30,
    });
    nonMarshed.layerWeights = new LayerWeightParams({ marsh: 1 });

    it("correcly identifies marshed regions", async () => {
      const result = await marshed.createMarshTiles();

      expect(result[0].feature).toEqual(FeatureType.marsh);
    });

    it("correcly identifies non-marshed regions", async () => {
      const result = await nonMarshed.createMarshTiles();

      for (const tile of result) {
        expect(tile).toEqual({});
      }
    });
  });

  describe("createForestTiles", () => {
    /* Blue Ridge Mountains, NC */
    const forested = createFromGridConfig({
      width: 1,
      height: 1,
      lon_start: -83.784476,
      lon_end: -83.3,
      lat_start: 35.149286,
      lat_end: 34.7,
    });

    /* Amazon */
    const rainForested = createFromGridConfig({
      width: 1,
      height: 1,
      lon_start: -66.206732,
      lon_end: -65,
      lat_start: -5,
      lat_end: -5.2,
    });

    /* North Slope Alaska */
    const nonForested = createFromGridConfig({
      width: 10,
      height: 10,
      lon_start: -156.462222,
      lon_end: -156,
      lat_start: 70.699283,
      lat_end: 70.2,
    });

    it("correcly identifies forested regions", async () => {
      const result = await forested.createForestTiles();

      expect(result[0].feature).toEqual(FeatureType.forest);
    });

    it("correcly identifies jungle regions", async () => {
      const result = await rainForested.createForestTiles();
      expect(result[0].feature).toEqual(FeatureType.jungle);
    });

    it("correcly identifies non-forested regions", async () => {
      const result = await nonForested.createForestTiles();

      for (const tile of result) {
        expect(tile).toEqual({});
      }
    });
  });
});
