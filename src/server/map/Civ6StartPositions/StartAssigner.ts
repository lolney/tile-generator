import { sortBy } from "lodash";
import { Quadrant } from "./types";
import { TilesArray } from "../../../common/TilesArray";
import { Tile } from "../../../common/types";
import FertilityMap from "./FertilityMap";

export default class StartAssigner {
  quadrants: Quadrant[];
  fertility: FertilityMap;
  tiles: TilesArray<Tile>;
  minorCount: number;
  majorCount: number;

  constructor(
    quadrants: Quadrant[],
    fertility: FertilityMap,
    tiles: TilesArray<Tile>,
    minorCount: number,
    majorCount: number
  ) {}

  assignStarts = () => {
    let candidateQuadrants = this.quadrants
      .filter(this.quadrantLandContent)
      .sort(this.sortByFertility);

    while (candidateQuadrants.length < this.count) {
      // candidateQuadrants = candidateQuadrants.flatMap(Quadrants.divideQuadrant)
    }

    return candidateQuadrants.slice(0, this.count).map((quad) => undefined); // this.fertility.maxScoredTile(quad))
  };

  get count() {
    return this.majorCount + this.minorCount;
  }

  subDivide = () => {
    // subdivide quadrants?
  };

  sortByFertility = (a: Quadrant, b: Quadrant) =>
    this.fertility.sumMap.sumBetweenValues(a.start, a.end) -
    this.fertility.sumMap.sumBetweenValues(b.start, b.end);

  quadrantLandContent = () => {};
}
