import { TilesArray } from "@tile-generator/common";

export default class SumMap {
  map: TilesArray<number>;

  constructor(valuesMap: TilesArray<number>) {
    this.map = SumMap.createSumMap(valuesMap);
  }

  static createSumMap = (valuesMap: TilesArray<number>) => {
    const tiles = valuesMap.cloneWith(0);
    for (const [i, j] of valuesMap.pairs()) {
      const val = valuesMap.get(i, j);
      const a = tiles.getWithBoundsCheck(i - 1, j - 1) || 0;
      const b = tiles.getWithBoundsCheck(i, j - 1) || 0;
      const c = tiles.getWithBoundsCheck(i - 1, j) || 0;
      tiles.set(i, j, val + b + c - a);
    }
    return tiles;
  };

  sumBetweenValues = (
    start: { i: number; j: number },
    end: { i: number; j: number }
  ) => {
    const startI = Math.max(0, start.i);
    const startJ = Math.max(0, start.j);
    const endI = Math.min(this.map.height - 1, end.i - 1);
    const endJ = Math.min(this.map.width - 1, end.j - 1);

    const endVal = this.map.getWithBoundsCheck(endI, endJ) || 0;
    const startVal = this.map.getWithBoundsCheck(startI - 1, startJ - 1) || 0;
    const leftVal = this.map.getWithBoundsCheck(endI, startJ - 1) || 0;
    const topVal = this.map.getWithBoundsCheck(startI - 1, endJ) || 0;

    return endVal + startVal - leftVal - topVal;
  };
}
