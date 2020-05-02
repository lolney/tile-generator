import { range } from "lodash";
import { TilesArray } from "@tile-generator/common";
import { Tile } from "@tile-generator/common";
import FertilityMap from "./FertilityMap";
import SumMap from "./SumMap";
import { TileUtils } from "@tile-generator/common";
import QuadrantSplitter from "./QuadrantSplitter";
import BufferedQuadrant from "./BufferedQuadrant";
import Quadrants from "./Quadrants";

export default class StartAssigner {
  quadrants: Quadrants;
  fertility: FertilityMap;
  tiles: TilesArray<Tile>;
  minorCount: number;
  majorCount: number;
  settlableCount: SumMap;

  constructor(
    quadrants: Quadrants,
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
    quadrants: Quadrants,
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
    const candidateQuadrants = Array.from(
      this.quadrants.bufferedQuadrants(),
      (quad) => (this.quadrantLandContent(quad) ? quad : null)
    );

    let filteredQuadrants = this.quadrants.removeBuffers(candidateQuadrants);

    filteredQuadrants = QuadrantSplitter.perform(
      filteredQuadrants,
      this.count,
      this.quadrantLandContent
    ).sort(this.sortByFertility);

    return filteredQuadrants
      .slice(0, this.count)
      .map((quad) => this.fertility.maxScoredTile(quad.quadrant));
  };

  get count() {
    return this.majorCount + this.minorCount;
  }

  sortByFertility = (a: BufferedQuadrant, b: BufferedQuadrant) =>
    this.fertility.sumMap.sumBetweenValues(b.quadrant.start, b.quadrant.end) -
    this.fertility.sumMap.sumBetweenValues(a.quadrant.start, a.quadrant.end);

  quadrantLandContent = ({ quadrant: { start, end } }: BufferedQuadrant) =>
    this.settlableCount.sumBetweenValues(start, end) > 0;
}
