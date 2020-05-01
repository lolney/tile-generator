import SumMap from "../SumMap";
import { TilesArray } from "@tile-generator/common";

describe("SumMap", () => {
  const tiles = new TilesArray(Array(100).fill(1), 10);
  const map = new SumMap(tiles);

  it.each([
    [{ i: 0, j: 0 }, { i: 10, j: 10 }, 100],
    [{ i: -100, j: -10 }, { i: 100, j: 100 }, 100],
    [{ i: 2, j: 2 }, { i: 4, j: 4 }, 4],
    [{ i: 0, j: 0 }, { i: 0, j: 0 }, 0],
  ])("should calc the sum between %j and %j", (start, end, expected) => {
    const result = map.sumBetweenValues(start, end);
    console.log(map.map.fields);
    expect(result).toEqual(expected);
  });
});
