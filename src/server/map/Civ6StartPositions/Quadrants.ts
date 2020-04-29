import { range } from "lodash";
import { Dimensions } from "../../../common/types";
import { QuadrantsTooSmallError } from "./errors";
import BufferedQuadrant from "./BufferedQuadrant";

export default class Quadrants {
  strides: {
    width: number[];
    height: number[];
  };

  static buffer = 2;

  constructor(dimensions: Dimensions, targetCount: number) {
    this.strides = Quadrants.getStrides(dimensions, targetCount);
  }

  get width() {
    return this.strides.width.length;
  }

  get height() {
    return this.strides.height.length;
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
      throw new QuadrantsTooSmallError(
        `Quadrants are too small to be buffered: ${JSON.stringify(
          this.strides
        )}`
      );

    for (const quadrant of this.quadrants()) {
      yield new BufferedQuadrant(quadrant, Quadrants.buffer);
    }
  }

  removeBuffers = (
    quads: Array<BufferedQuadrant | null>
  ): BufferedQuadrant[] => {
    const getQuad = (i: number, j: number) => {
      if (i < 0 || j < 0 || j >= this.width || i >= this.height) return null;
      return quads[i * this.width + j];
    };

    const getSide = (i: number, j: number) => {
      switch (`${i},${j}`) {
        case "-1,0":
          return "top";
        case "1,0":
          return "bottom";
        case "0,-1":
          return "left";
        case "0,1":
          return "right";
        default:
          throw new Error("unreachable");
      }
    };

    for (const i of range(0, this.height)) {
      for (const j of range(0, this.width)) {
        for (const [ii, jj] of [
          [-1, 0],
          [1, 0],
          [0, -1],
          [0, 1],
        ]) {
          if (getQuad(i + ii, j + jj) == null) {
            getQuad(i, j)?.remove(getSide(ii, jj));
          }
        }
      }
    }

    return quads.filter((elem) => elem) as BufferedQuadrant[];
  };

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
