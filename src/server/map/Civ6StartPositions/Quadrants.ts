import { range } from "lodash";
import { Dimensions } from "../../../common/types";

export default class Quadrants {
  strides: {
    width: number[];
    height: number[];
  };

  static buffer = 2;

  constructor(dimensions: Dimensions, targetCount: number) {
    this.strides = Quadrants.getStrides(dimensions, targetCount);
  }

  *quadrants() {
    const coords = { i: 0, j: 0 };
    const coordsNext = { i: 0, j: 0 };

    for (const heightStride of this.strides.height) {
      coords.j = 0;
      coordsNext.j = 0;
      coordsNext.i += heightStride;
      for (const widthStride of this.strides.width) {
        coordsNext.j += widthStride;
        yield { start: { ...coords }, end: { ...coordsNext } };
        coords.j = coordsNext.j;
      }
      coords.i = coordsNext.i;
    }
  }

  *bufferedQuadrants() {
    const totalBuffer = Quadrants.buffer * 2;
    if (
      [...this.strides.height, ...this.strides.width].some(
        (val) => val <= totalBuffer
      )
    )
      throw new Error(
        `Quadrants are too small to be buffered: ${JSON.stringify(
          this.strides
        )}`
      );

    for (const quadrant of this.quadrants()) {
      quadrant.start.i += Quadrants.buffer;
      quadrant.start.j += Quadrants.buffer;
      quadrant.end.i -= Quadrants.buffer;
      quadrant.end.j -= Quadrants.buffer;
      yield quadrant;
    }
  }

  static getStrides({ width, height }: Dimensions, targetCount: number) {
    const total = width + height;

    const strides = [width, height].map((dimension) => {
      const divisions = Math.ceil(Math.pow(targetCount, dimension / total));
      const remainder = dimension % divisions;
      const strides = Array(divisions).fill(Math.floor(dimension / divisions));

      for (const i of range(remainder)) {
        strides[i]++;
      }

      return strides;
    });

    return {
      width: strides[0],
      height: strides[1],
    };
  }
}
