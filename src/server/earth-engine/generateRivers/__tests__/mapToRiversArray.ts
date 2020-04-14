import { range } from "lodash";
import mapToRiversArray, { threshold } from "../mapToRiversArray";
import { Tile, TerrainType } from "../../../../common/types";

describe("mapToRiversArray", () => {
  const rawData = range(0, 1.25 * threshold, 0.05 * threshold);
  const waterLayer = [] as Tile[];
  const dimensions = { width: 60, height: 60 };
  const diameter = 1000;

  it("should include 20% of the raw data if 20% is above threshold", () => {
    const result = mapToRiversArray(rawData, waterLayer, dimensions, diameter);
    expect(result.fields.filter((elem) => elem)).toHaveLength(
      Math.round(rawData.length * 0.2)
    );
  });

  it("should include no elems if all are below the min", () => {
    const result = mapToRiversArray(
      range(0, 10, 0.1),
      waterLayer,
      dimensions,
      diameter
    );
    expect(result.fields.filter((elem) => elem)).toHaveLength(0);
  });

  it("should include no elems if all are water", () => {
    const result = mapToRiversArray(
      rawData,
      rawData.map(() => ({ terrain: TerrainType.coast })),
      dimensions,
      diameter
    );
    expect(result.fields.filter((elem) => elem)).toHaveLength(0);
  });
});
