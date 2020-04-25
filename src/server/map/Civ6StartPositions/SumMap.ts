import { TilesArray } from "../../../common/TilesArray";

export default class SumMap {
  map: TilesArray<number>;

  constructor(valuesMap: TilesArray<number>) {
    this.map = SumMap.createSumMap(valuesMap);
  }

  static createSumMap = (valuesMap: TilesArray<number>) =>
    new TilesArray(
      Array.from(valuesMap.pairs(), ([i, j]) => {
        const val = valuesMap.get(i, j);
        const a = valuesMap.getWithBoundsCheck(i - 1, j - 1) || 0;
        const b = valuesMap.getWithBoundsCheck(i, j - 1) || 0;
        const c = valuesMap.getWithBoundsCheck(i - 1, j) || 0;
        return val + b + c - a;
      }),
      valuesMap.width
    );

  sumBetweenValues = (
    start: { i: number; j: number },
    end: { i: number; j: number }
  ) => {
    if (
      start.i < 0 ||
      start.j < 0 ||
      end.i >= this.map.height ||
      end.j >= this.map.width
    )
      throw new Error(
        `Out of bounds: ${start}, ${end} for dimensions ${this.map.width}, ${this.map.height}`
      );

    const endVal = this.map.get(end.i, end.j);
    const startVal = this.map.getWithBoundsCheck(start.i - 1, start.j - 1) || 0;
    const leftVal = this.map.getWithBoundsCheck(end.i, start.j - 1) || 0;
    const topVal = this.map.getWithBoundsCheck(end.i - 1, start.j) || 0;

    return endVal + startVal - leftVal - topVal;
  };
}
