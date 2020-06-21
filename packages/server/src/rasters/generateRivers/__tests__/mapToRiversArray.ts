import { range } from "lodash";
import mapToTilesArray, { BASE_RAINFALL } from "../mapToRiversArray";
import { Tile, TerrainType } from "@tile-generator/common";
import { LayerWeightParams } from "../../LayerWeightParams";

describe("mapToRiversArray", () => {
  const rawData = range(0, 1000, 10);
  const rainfallLayer = Array(rawData.length).fill(BASE_RAINFALL);
  const waterLayer = range(0, 1000, 10).map(() => ({
    terrain: TerrainType.grass,
  })) as Tile[];
  const dimensions = { width: 60, height: 60 };

  it("should cover 20% of tiles if rainfall is at the base rainfall", () => {
    const result = mapToTilesArray(
      rawData,
      waterLayer,
      dimensions,
      rainfallLayer,
      new LayerWeightParams()
    );
    expect(result.fields.filter((elem) => elem)).toHaveLength(19);
  });

  it("should include less than 25% if rainfall is lower than the base", () => {
    const result = mapToTilesArray(
      rawData,
      waterLayer,
      dimensions,
      Array(rawData.length).fill((BASE_RAINFALL * 9) / 10),
      new LayerWeightParams()
    );
    const length = result.fields.filter((elem) => elem).length;
    expect(length).toBeLessThan(19);
    expect(length).toBeGreaterThan(0);
  });

  it("should include no elems if all are water", () => {
    const result = mapToTilesArray(
      rawData,
      rawData.map(() => ({ terrain: TerrainType.coast })),
      dimensions,
      rainfallLayer,
      new LayerWeightParams()
    );
    expect(result.fields.filter((elem) => elem)).toHaveLength(0);
  });
});
