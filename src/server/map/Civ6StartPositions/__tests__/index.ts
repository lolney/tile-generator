import { findStartPositions } from "../index";
import italyTiles from "../../../../fixtures/tiles-italy-24-24.json";
import tibetTiles from "../../../../fixtures/tiles-tibet-80-80.json";
import { TilesArray } from "../../../../common/TilesArray";
import { Tile } from "../../../../common/types";

describe("findStartPositions", () => {
  const duelParams = {
    width: 24,
    height: 24,
    minorCount: 3,
    majorCount: 2,
  };

  const hugeParams = {
    width: 80,
    height: 80,
    minorCount: 24,
    majorCount: 12,
  };

  const checkTiles = (
    rawTiles: Tile[],
    { width, height, majorCount, minorCount }: typeof duelParams
  ) => {
    const tiles = new TilesArray(rawTiles, width);
    const { majors, minors } = findStartPositions(
      tiles,
      minorCount,
      majorCount
    );

    expect(majors).toHaveLength(majorCount);
    expect(minors).toHaveLength(minorCount);

    for (const start of [...majors, ...minors]) {
      expect(start.i).toBeGreaterThanOrEqual(0);
      expect(start.i).toBeLessThan(height);
      expect(start.j).toBeGreaterThanOrEqual(0);
      expect(start.j).toBeLessThan(width);
    }
  };

  it.each([["italyTiles", italyTiles]])(
    "should generate start positions for a duel map %p",
    (_, rawTiles: Tile[]) => {
      checkTiles(rawTiles, duelParams);
    }
  );

  it.each([["tibetTiles", tibetTiles]])(
    "should generate start positions for a huge map %p",
    (_, rawTiles: Tile[]) => {
      checkTiles(rawTiles, hugeParams);
    }
  );
});
