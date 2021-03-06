import { TilesArray } from "@tile-generator/common";

describe("TilesArray", () => {
  describe("neighbors", () => {
    const array = TilesArray.from2D([
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 9],
    ]);

    it("should return the neighbors of the given pair", () => {
      const neighbors = Array.from(array.neighbors(1, 1));
      expect(neighbors).toEqual([
        [1, 0],
        [0, 0],
        [0, 1],
        [1, 2],
        [2, 1],
        [2, 0],
      ]);
    });
  });
});
