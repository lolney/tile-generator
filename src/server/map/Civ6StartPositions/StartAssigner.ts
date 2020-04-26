import { Quadrant } from "./types";
import { TilesArray } from "../../../common/TilesArray";
import { Tile } from "../../../common/types";
import FertilityMap from "./FertilityMap";
import SumMap from "./SumMap";
import TileUtils from "../../../common/Tile";

export default class StartAssigner {
  quadrants: Quadrant[];
  fertility: FertilityMap;
  tiles: TilesArray<Tile>;
  minorCount: number;
  majorCount: number;
  settlableCount: SumMap;

  constructor(
    quadrants: Quadrant[],
    fertility: FertilityMap,
    tiles: TilesArray<Tile>,
    minorCount: number,
    majorCount: number
  ) {
    this.quadrants = quadrants;
    this.fertility = fertility;
    this.tiles = tiles;
    this.minorCount = minorCount;
    this.majorCount = majorCount;
    this.settlableCount = new SumMap(
      new TilesArray<number>(
        tiles.fields.map((tile) => (TileUtils.isSettlable(tile) ? 1 : 0)),
        tiles.width
      )
    );
  }

  static process = (
    quadrants: Quadrant[],
    fertility: FertilityMap,
    tiles: TilesArray<Tile>,
    minorCount: number,
    majorCount: number
  ) =>
    new StartAssigner(
      quadrants,
      fertility,
      tiles,
      minorCount,
      majorCount
    ).assignStarts();

  assignStarts = () => {
    let candidateQuadrants = this.quadrants
      .filter(this.quadrantLandContent)
      .sort(this.sortByFertility);

    while (candidateQuadrants.length < this.count) {
      throw new Error(
        `Not enough land to generate the map: need ${this.count}, narrowed to ${candidateQuadrants.length} from ${this.quadrants.length} quadrants `
      );
      // candidateQuadrants = candidateQuadrants.flatMap(Quadrants.divideQuadrant)
    }

    return candidateQuadrants
      .slice(0, this.count)
      .map((quad) => this.fertility.maxScoredTile(quad));
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

  quadrantLandContent = ({ start, end }: Quadrant) =>
    this.settlableCount.sumBetweenValues(start, end) > 0;
}
