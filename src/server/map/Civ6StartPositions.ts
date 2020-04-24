import { range } from "lodash";
import { Dimensions } from "../../common/types";

/* 
algo:
1. divide into quadrants: equal to 2x # of major + minor civs
(rounding to the lowest non-prime number)

2. calculate a start score based on:
    - number of land tiles in the vicinity
    - fertility in the vicinity
    - for the plot itself: +1 for river or coastal

3. Eliminate all quadrants that don't meet the score threshold.
Assign major civs to quadrants, then minor civs.
Any minor civs left over get assigned to some land tile at least 6 spaces from everyone else.

- fertility:
- +1 for river
- + 1 for forest or jungle
- 0 for desert, ice, tundra, mountain
- 2 for plains
- 3 for grassland

*/

/*
20, 20, 6

3 divides 20? nope ->
7 is prime ->
8 -> 4 divides 20? yep 2 divides 20? yep
*/

// todo: just get the sqrt and divide the remainder accordingly
export class Quadrants {
  dimensions: Dimensions;
  divisions: Dimensions;
  strides: Dimensions;

  constructor(dimensions: Dimensions, targetCount: number) {
    this.dimensions = dimensions;
    this.divisions = Quadrants.getDivisions(dimensions, targetCount);
    this.strides = {
      width: this.dimensions.width / this.divisions.width,
      height: this.dimensions.height / this.divisions.height,
    };
  }

  *quadrants() {
    for (const row of range(0, this.divisions.height)) {
      for (const col of range(this.divisions.width)) {
        yield { i: this.strides.width * col, j: this.strides.height * row };
      }
    }
  }

  static getDivisions({ width, height }: Dimensions, initial: number) {
    let n = initial;
    for (; ; n++)
      for (const factor of Quadrants.factors(n)) {
        if (width % factor === 0 && height % (n / factor) === 0)
          return { width: factor, height: n / factor };
        if (height % factor === 0 && width % (n / factor) === 0)
          return { width: n / factor, height: factor };
      }
  }

  static *factors(n: number) {
    const set = new Set();
    for (const i of range(Math.floor(Math.sqrt(n)), 1, -1)) {
      const j = n / i;
      if (Number.isInteger(j)) {
        set.add(i);
        set.add(j);
        yield j;
        yield i;
      }
    }
  }
}
