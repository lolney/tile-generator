import isLandLocal from "./isLandLocal";
import { Polygon } from "geojson";

const fixtures: { [key: string]: Polygon } = {
  isLand: {
    type: "Polygon",
    coordinates: [[[20, 20], [20, 21], [21, 21], [21, 20], [20, 20]]]
  },
  isWater: {
    type: "Polygon",
    coordinates: [[[0, 0], [0, 1], [1, 1], [1, 0], [0, 0]]]
  }
};

describe("isLandLocal", () => {
  it("returns true for land tiles", async () => {
    const result = await isLandLocal([fixtures.isLand]);

    expect(result[0]).toBe(true);
  }, 20000);

  it("returns false for water tiles", async () => {
    const result = await isLandLocal([fixtures.isWater]);

    expect(result[0]).toBe(false);
  }, 20000);
});
