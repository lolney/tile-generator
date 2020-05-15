import { range } from "lodash";
import mapToTilesArray, { BASE_RAINFALL } from "../mapToRiversArray";
import { Tile, TerrainType } from "@tile-generator/common";

describe("mapToRiversArray", () => {
  const rawData = range(0, 1000, 10);
  const rainfallLayer = Array(rawData.length).fill(BASE_RAINFALL);
  const waterLayer = [] as Tile[];
  const dimensions = { width: 60, height: 60 };

  it("should 25% of tiles if rainfall is at the base rainfall", () => {
    const result = mapToTilesArray(
      rawData,
      waterLayer,
      dimensions,
      rainfallLayer
    );
    expect(result.fields.filter((elem) => elem)).toHaveLength(24);
  });

  it("should include less than 25% if rainfall is lower than the base", () => {
    const result = mapToTilesArray(
      rawData,
      waterLayer,
      dimensions,
      Array(rawData.length).fill((BASE_RAINFALL * 3) / 4)
    );
    const length = result.fields.filter((elem) => elem).length;
    expect(length).toBeLessThan(25);
    expect(length).toBeGreaterThan(0);
  });

  it("should include no elems if all are water", () => {
    const result = mapToTilesArray(
      rawData,
      rawData.map(() => ({ terrain: TerrainType.coast })),
      dimensions,
      rainfallLayer
    );
    expect(result.fields.filter((elem) => elem)).toHaveLength(0);
  });
});
