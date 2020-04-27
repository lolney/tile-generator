import { Quadrant } from "./types";
import { TilesArray } from "../../../common/TilesArray";
import { Tile } from "../../../common/types";
import FertilityMap from "./FertilityMap";
import SumMap from "./SumMap";
import TileUtils from "../../../common/Tile";
import QuadrantSplitter from "./QuadrantSplitter";

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
    // todo: remove buffer to adjoining tile if filtered out
    let candidateQuadrants = this.quadrants.filter(this.quadrantLandContent);

    candidateQuadrants = QuadrantSplitter.perform(
      candidateQuadrants,
      this.count,
      this.quadrantLandContent
    ).sort(this.sortByFertility);

    return candidateQuadrants
      .slice(0, this.count)
      .map((quad) => this.fertility.maxScoredTile(quad));
  };

  get count() {
    return this.majorCount + this.minorCount;
  }

  sortByFertility = (a: Quadrant, b: Quadrant) =>
    this.fertility.sumMap.sumBetweenValues(b.start, b.end) -
    this.fertility.sumMap.sumBetweenValues(a.start, a.end);

  quadrantLandContent = ({ start, end }: Quadrant) =>
    this.settlableCount.sumBetweenValues(start, end) > 0;
}
