import { TilesArray } from "../../../common/TilesArray";
import { Tile } from "../../../common/types";
import Quadrants from "./Quadrants";
import FertilityMap from "./FertilityMap";

export const findStartPositions = (
  tiles: TilesArray<Tile>,
  minorCount: number,
  majorCount: number
) => {
  // 1. divide into quadrants: equal to 2x # of major + minor civs
  // (rounding to the lowest non-prime number)
  const quadrants = new Quadrants(
    { width: tiles.width, height: tiles.height },
    minorCount + majorCount
  );

  // 2. calculate fertility score
  const fertility = new FertilityMap(tiles);

  // Eliminate all tiles that don't meet fertility score or min land tiles

  // 3. Eliminate all quadrants that don't meet the score threshold.
  // Assign major civs to quadrants, then minor civs.
  // Any minor civs left over get assigned to some land tile at least 6 spaces from everyone else.

  return {
    majors: [{}],
  };
};
