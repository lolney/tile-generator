import { TilesArray } from "../../../common/TilesArray";
import { Tile } from "../../../common/types";
import Quadrants from "./Quadrants";
import FertilityMap from "./FertilityMap";
import StartAssigner from "./StartAssigner";

const findStartPositions = (
  tiles: TilesArray<Tile>,
  minorCount: number,
  majorCount: number
) => {
  // 1. divide into quadrants: equal to 2x # of major + minor civs
  const quadrants = new Quadrants(
    { width: tiles.width, height: tiles.height },
    minorCount + majorCount
  );

  // 2. calculate fertility score
  const fertility = new FertilityMap(tiles);

  // 3. Eliminate all tiles that don't meet fertility score or min land tiles
  const startPositions = StartAssigner.process(
    quadrants,
    fertility,
    tiles,
    minorCount,
    majorCount
  );

  return {
    majors: startPositions.slice(0, majorCount).map((val) => val?.coords!),
    minors: startPositions.slice(majorCount).map((val) => val?.coords!),
  };
};

export default findStartPositions;
