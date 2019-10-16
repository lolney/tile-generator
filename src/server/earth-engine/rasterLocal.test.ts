import { isLandLocal, findSlopeLocal, isRiverLocal } from "./rasterLocal";
import { Polygon } from "geojson";

const fixtures: { [key: string]: Polygon } = {
  isLand: {
    type: "Polygon",
    coordinates: [[[20, 20], [20, 21], [21, 21], [21, 20], [20, 20]]]
  },
  isWater: {
    type: "Polygon",
    coordinates: [[[0, 0], [0, 1], [1, 1], [1, 0], [0, 0]]]
  },
  connecticutRiver: {
    // connecticut river
    type: "Polygon",
    coordinates: [
      [
        [-72.501716, 42.741314],
        [-72.431966, 42.741314],
        [-72.431966, 42.699798],
        [-72.431966, 42.699798],
        [-72.501716, 42.741314]
      ]
    ]
  },
  sacDelta: {
    // connecticut river
    type: "Polygon",
    coordinates: [
      [
        [-121.8603, 38.0762],
        [-121.8191, 38.0762],
        [-121.8191, 38.0505],
        [-121.8603, 38.0505],
        [-121.8603, 38.0762]
      ]
    ]
  },
  highSlope: {
    type: "Polygon",
    coordinates: [
      [
        [-118.36851393399849, 36.82474374202621],
        [-118.36851393399849, 36.78075983683096],
        [-118.30808912931099, 36.78075983683096],
        [-118.30808912931099, 36.82474374202621],
        [-118.36851393399849, 36.82474374202621]
      ]
    ]
  },
  mixedWater: {
    type: "Polygon",
    coordinates: [
      [
        [-121.46088445726821, 35.8872360802492],
        [-121.46088445726821, 35.86331151880396],
        [-121.42947042528579, 35.86331151880396],
        [-121.42947042528579, 35.8872360802492],
        [-121.46088445726821, 35.8872360802492]
      ]
    ]
  }
};

describe("isLandLocal", () => {
  it("returns true for land tiles", async () => {
    const [result] = await isLandLocal([fixtures.isLand]);

    expect(result).toBe(true);
  });

  it("returns false for water tiles", async () => {
    const [result] = await isLandLocal([fixtures.isWater]);

    expect(result).toBe(false);
  });
});

describe("findSlopeLocal", () => {
  it("is null for water tiles", async () => {
    const [result] = await findSlopeLocal([fixtures.isWater]);

    expect(result).toBeNull();
  });

  it("is > 10 for mountain tiles", async () => {
    const [result] = await findSlopeLocal([fixtures.highSlope]);

    expect(result).toBeGreaterThan(10);
  });

  it("is non-null for mixed water tiles", async () => {
    for (let i = 0; i < 5; i++) {
      const [result] = await findSlopeLocal([fixtures.mixedWater]);

      expect(result).not.toBeNull();
    }
  });
});

describe("isRiverLocal", () => {
  it("is 0 for tiles with no rivers", async () => {
    const [result] = await isRiverLocal([fixtures.isWater]);

    expect(result).toBe(0);
  });

  it("is > 3 for tiles with rivers", async () => {
    const results = await isRiverLocal([
      fixtures.sacDelta,
      fixtures.connecticutRiver
    ]);

    for (const result of results) {
      expect(result).toBeGreaterThan(3);
    }
  });
});
