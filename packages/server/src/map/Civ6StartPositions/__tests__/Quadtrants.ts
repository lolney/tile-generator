import { mapValues } from "lodash";
import Quadrants from "../Quadrants";
import { QuadrantsTooSmallError } from "../errors";
import BufferedQuadrant from "../BufferedQuadrant";

describe("Quadrants", () => {
  it.each([
    [
      6,
      { width: 20, height: 20 },
      {
        width: [7, 7, 6],
        height: [7, 7, 6],
      },
    ],
    [
      21,
      { width: 100, height: 79 },
      { width: [17, 17, 17, 17, 16, 16], height: [20, 20, 20, 19] },
    ],
  ])(
    "should divide the tiles properly for targetCount %p and dims %p",
    (targetCount, dimensions, strides) => {
      const quadrants = new Quadrants(dimensions, targetCount);
      expect(quadrants.strides).toEqual(strides);
    }
  );

  it.each([
    [
      6,
      { width: 20, height: 20 },
      [
        { start: { i: 0, j: 0 }, end: { i: 7, j: 7 } },
        { start: { i: 0, j: 7 }, end: { i: 7, j: 14 } },
        { start: { i: 0, j: 14 }, end: { i: 7, j: 20 } },
        { start: { i: 7, j: 0 }, end: { i: 14, j: 7 } },
        { start: { i: 7, j: 7 }, end: { i: 14, j: 14 } },
        { start: { i: 7, j: 14 }, end: { i: 14, j: 20 } },
        { start: { i: 14, j: 0 }, end: { i: 20, j: 7 } },
        { start: { i: 14, j: 7 }, end: { i: 20, j: 14 } },
        { start: { i: 14, j: 14 }, end: { i: 20, j: 20 } },
      ],
    ],
  ])(
    "should divide the tiles properly for targetCount %p and dims %p",
    (targetCount, dimensions, expectedQuadrants) => {
      const quadrants = new Quadrants(dimensions, targetCount);
      expect(Array.from(quadrants.quadrants())).toEqual(expectedQuadrants);
    }
  );
});

describe("buffered quadrants", () => {
  const { buffer } = Quadrants;
  const twiceBuffer = buffer * 2;

  it.each([
    [
      6,
      { width: 20, height: 20 },
      [
        { start: { i: 0, j: 0 }, end: { i: 7, j: 7 } },
        { start: { i: 0, j: 7 }, end: { i: 7, j: 14 } },
        { start: { i: 0, j: 14 }, end: { i: 7, j: 20 } },
        { start: { i: 7, j: 0 }, end: { i: 14, j: 7 } },
        { start: { i: 7, j: 7 }, end: { i: 14, j: 14 } },
        { start: { i: 7, j: 14 }, end: { i: 14, j: 20 } },
        { start: { i: 14, j: 0 }, end: { i: 20, j: 7 } },
        { start: { i: 14, j: 7 }, end: { i: 20, j: 14 } },
        { start: { i: 14, j: 14 }, end: { i: 20, j: 20 } },
      ].map(({ start, end }) => ({
        start: mapValues(start, (val) => val + buffer),
        end: mapValues(end, (val) => val - buffer),
      })),
    ],
  ])(
    "should place the appropriate buffer for targetCount %p and dims %p",
    (targetCount, dimensions, expectedQuadrants) => {
      const quadrants = new Quadrants(dimensions, targetCount);
      expect(
        Array.from(quadrants.bufferedQuadrants(), (quad) => quad.quadrant)
      ).toEqual(expectedQuadrants);
    }
  );

  it.each([
    {
      width: [twiceBuffer + 1, twiceBuffer],
      height: [twiceBuffer + 1, twiceBuffer],
    },
    { width: [twiceBuffer, buffer], height: [twiceBuffer, buffer] },
    { width: [twiceBuffer, buffer - 1], height: [twiceBuffer, buffer - 1] },
  ])(
    "should place the appropriate buffer for targetCount %p and dims %p",
    (strides) => {
      const quadrants = new Quadrants({ width: 20, height: 20 }, 6);
      quadrants.strides = strides;
      expect(() => Array.from(quadrants.bufferedQuadrants())).toThrow(
        QuadrantsTooSmallError
      );
    }
  );

  it.each([[4, { width: 20, height: 20 }]])(
    "should trim quadrants appropriately when one is missing",
    (targetCount, dimensions) => {
      const quadrants = new Quadrants(dimensions, targetCount);
      const buffered: Array<BufferedQuadrant | null> = Array.from(
        quadrants.bufferedQuadrants()
      );
      buffered[0] = null;
      const trimmed = quadrants.removeBuffers(buffered);

      expect(trimmed.map((quad) => quad.buffers)).toEqual([
        {
          bottom: 2,
          left: 0,
          right: 0,
          top: 0,
        },
        {
          bottom: 0,
          left: 0,
          right: 2,
          top: 0,
        },
        {
          bottom: 0,
          left: 2,
          right: 0,
          top: 2,
        },
      ]);
    }
  );
});
