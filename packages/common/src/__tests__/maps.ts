import { Civ5MapSize, Civ6MapSize } from "../maps";
import { sizeStrings } from "../types";

describe.each([Civ5MapSize, Civ6MapSize])("MapSize", (Class) => {
  it.each([
    { width: 0, height: 1 },
    { width: 1000, height: 1000 },
  ])("should return a map size", (dimensions) => {
    const mapSize = Class.dimensionsToMapSize(dimensions);
    expect(sizeStrings).toContain(mapSize);
  });
});
