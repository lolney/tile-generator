import { QuadrantsTooSmallError, StartGenerationError } from "./errors";
import { Quadrant } from "./types";
import Quadrants from "./Quadrants";
import BufferedQuadrant from "./BufferedQuadrant";

export default class QuadrantSplitter {
  targetCount: number;
  startCount: number;
  filter: (quad: BufferedQuadrant) => boolean;
  private splitQuadrants: BufferedQuadrant[];
  private nonSplitQuadrants: BufferedQuadrant[];
  private unsplitableQuadrants: BufferedQuadrant[];

  constructor(
    inputQuadrants: BufferedQuadrant[],
    targetCount: number,
    filter: (quad: BufferedQuadrant) => boolean
  ) {
    this.targetCount = targetCount;
    this.filter = filter;
    this.startCount = inputQuadrants.length;
    this.nonSplitQuadrants = [...inputQuadrants];
    this.splitQuadrants = [];
    this.unsplitableQuadrants = [];
  }

  static perform = (
    inputQuadrants: BufferedQuadrant[],
    targetCount: number,
    filter: (quad: BufferedQuadrant) => boolean
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

  getCandidate = (): BufferedQuadrant => {
    if (
      this.nonSplitQuadrants.length === 0 &&
      this.splitQuadrants.length === 0
    ) {
      console.log(
        this.quadrants,
        this.quadrants.map((quad) => quad.quadrant)
      );
      throw new StartGenerationError(
        `Not enough land to assign all start positions: need ${this.targetCount}, narrowed to ${this.quadrants.length} from ${this.startCount} quadrants`
      );
    }
    if (this.nonSplitQuadrants.length === 0) {
      this.nonSplitQuadrants = this.splitQuadrants;
      this.nonSplitQuadrants = [];
    }
    return this.nonSplitQuadrants.pop()!;
  };

  static split(quad: BufferedQuadrant): BufferedQuadrant[] {
    const { start, end } = quad.quadrant;
    const width = end.j - start.j;
    const height = end.i - start.i;
    try {
      return QuadrantSplitter.adjustBuffers(
        quad.quadrant,
        Array.from(new Quadrants({ width, height }, 2).quadrants())
      );
    } catch (error) {
      if (error instanceof QuadrantsTooSmallError) {
        console.warn(
          `Quadrant too small: ${JSON.stringify(start)}, ${JSON.stringify(
            end
          )}: ${error}`
        );
        return [];
      }
      throw error;
    }
  }

  static throwTooSmallError = (quadrants: Quadrant[]) => {
    throw new QuadrantsTooSmallError(
      `Quadrants too small to add buffer between them: ${JSON.stringify(
        quadrants
      )}`
    );
  };

  static adjustBuffers(original: Quadrant, newQuads: Quadrant[]) {
    const { start } = original;
    const bufferedNewQuads = newQuads.map(
      (quad) => new BufferedQuadrant(quad, Quadrants.buffer, [])
    );
    // vertical
    if (newQuads[0].start.j === newQuads[1].start.j) {
      bufferedNewQuads[0].add("bottom");
      bufferedNewQuads[1].add("top");
      if (
        bufferedNewQuads.some(
          ({ quadrant }) => quadrant.start.i >= quadrant.end.i
        )
      ) {
        QuadrantSplitter.throwTooSmallError(newQuads);
      }
    }
    // horizontal
    if (newQuads[0].start.i === newQuads[1].start.i) {
      bufferedNewQuads[0].add("right");
      bufferedNewQuads[1].add("left");
      if (
        bufferedNewQuads.some(
          ({ quadrant }) => quadrant.start.j >= quadrant.end.j
        )
      ) {
        QuadrantSplitter.throwTooSmallError(newQuads);
      }
    }
    return bufferedNewQuads.map(({ quadrant, ...rest }) => ({
      quadrant: {
        start: { i: quadrant.start.i + start.i, j: quadrant.start.j + start.j },
        end: { i: quadrant.end.i + start.i, j: quadrant.end.j + start.j },
      },
      ...rest,
    }));
  }
}
