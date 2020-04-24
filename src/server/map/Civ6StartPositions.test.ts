import { Quadrants } from "./Civ6StartPositions";

describe("Quadrants", () => {
  it.each([
    [
      6,
      { width: 20, height: 20 },
      { width: 4, height: 2 },
      { width: 5, height: 10 },
    ],
    [
      21,
      { width: 100, height: 79 },
      { width: 2, height: 79 },
      { width: 1, height: 50 },
    ],
  ])(
    "should divide the tiles properly for targetCount %p and dims %p",
    (targetCount, dimensions, divisions, strides) => {
      const quadrants = new Quadrants(dimensions, targetCount);
      expect(quadrants.divisions).toEqual(divisions);
      expect(quadrants.strides).toEqual(strides);
    }
  );
});
