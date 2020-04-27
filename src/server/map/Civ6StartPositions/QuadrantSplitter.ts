import { QuadrantsTooSmallError, StartGenerationError } from "./errors";
import { Quadrant } from "./types";
import Quadrants from "./Quadrants";

export default class QuadrantSplitter {
  targetCount: number;
  startCount: number;
  filter: (quad: Quadrant) => boolean;
  private splitQuadrants: Quadrant[];
  private nonSplitQuadrants: Quadrant[];
  private unsplitableQuadrants: Quadrant[];

  constructor(
    inputQuadrants: Quadrant[],
    targetCount: number,
    filter: (quad: Quadrant) => boolean
  ) {
    this.targetCount = targetCount;
    this.filter = filter;
    this.startCount = inputQuadrants.length;
    this.nonSplitQuadrants = inputQuadrants;
    this.splitQuadrants = [];
    this.unsplitableQuadrants = [];
  }

  static perform = (
    inputQuadrants: Quadrant[],
    targetCount: number,
    filter: (quad: Quadrant) => boolean
  ) => new QuadrantSplitter(inputQuadrants, targetCount, filter).perform();

  perform() {
    while (this.quadrants.length < this.targetCount) {
      const quad = this.getCandidate();
      const splitQuads = QuadrantSplitter.split(quad).filter(this.filter);
      splitQuads.length > 1
        ? (this.splitQuadrants = this.splitQuadrants.concat(splitQuads))
        : this.unsplitableQuadrants.push(quad);
    }
    return this.quadrants;
  }

  get quadrants() {
    return [
      ...this.splitQuadrants,
      ...this.nonSplitQuadrants,
      ...this.unsplitableQuadrants,
    ];
  }

  getCandidate = (): Quadrant => {
    if (
      this.nonSplitQuadrants.length === 0 &&
      this.splitQuadrants.length === 0
    ) {
      throw new StartGenerationError(
        `Not enough land to generate the map: need ${this.targetCount}, narrowed to ${this.quadrants.length} from ${this.startCount} quadrants`
      );
    }
    if (this.nonSplitQuadrants.length === 0) {
      this.nonSplitQuadrants = this.splitQuadrants;
      this.nonSplitQuadrants = [];
    }
    return this.nonSplitQuadrants.pop()!;
  };

  static split({ start, end }: Quadrant) {
    const width = end.j - start.j;
    const height = end.i - start.i;
    try {
      return Array.from(
        new Quadrants({ width, height }, 2).quadrants(),
        (quad) => ({
          start: { i: quad.start.i + start.i, j: quad.start.j + start.j },
          end: { i: quad.end.i + start.i, j: quad.end.j + start.j },
        })
      );
    } catch (error) {
      if (error instanceof QuadrantsTooSmallError) {
        console.warn(
          `Quadrant too small: ${JSON.stringify(start)}, ${JSON.stringify(end)}`
        );
        return [];
      }
      throw error;
    }
  }
}
