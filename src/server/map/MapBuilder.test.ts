import createRawHexGrid, { params } from "../../common/createRawHexGrid";
import MapBuilder from "./MapBuilder";
import { LatLngBounds } from "leaflet";
import { FeatureType } from "../../common/types";
import EarthEngine from "../earth-engine/EarthEngine";

function createFromGridConfig(params: params) {
  const height =
    (params.height / params.width) * (params.lon_end - params.lon_start);
  const bounds = new LatLngBounds(
    [params.lat_start - height, params.lon_start],
    [params.lat_start, params.lon_end]
  );

  const grid = createRawHexGrid(params);

  return new MapBuilder(grid, bounds);
}

describe("MapBuilder", () => {
  beforeAll(async () => {
    await EarthEngine.init();
  });

  describe("createMarshTiles", () => {
    /* Mississippi delta */
    const marshed = createFromGridConfig({
      width: 1,
      height: 1,
      lon_start: -90.1,
      lon_end: -89.7,
      lat_start: 29.7
    });

    /* Western great plains */
    const nonMarshed = createFromGridConfig({
      width: 10,
      height: 10,
      lon_start: -110,
      lon_end: -100,
      lat_start: 40
    });

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
});
