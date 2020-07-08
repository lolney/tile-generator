import { Position } from "geojson";
import { addOffsets, calcUnit } from "./common";

type params = {
  width: number;
  height: number;
  lon_start: number;
  lon_end: number;
  lat_start: number;
  lat_end: number;
};

export const evenOffsets: Position[] = [
  // lng, lat
  [0.5, 0.25],
  [1, 0],
];

export const oddOffsets: Position[] = [
  // lng, lat
  [0.5, -0.25],
  [1, 0],
];

export function createPeak(
  start: Position,
  x_unit: number,
  y_unit: number,
  isOdd: boolean
): Position[] {
  return addOffsets(isOdd ? oddOffsets : evenOffsets, start, x_unit, y_unit);
}

export function createRawHexPositions({
  width,
  height,
  lon_start,
  lon_end,
  lat_start,
  lat_end,
}: params): Position[] {
  var x_unit = calcUnit(lon_start, lon_end, width);
  const y_unit = calcUnit(lat_end, lat_start, height) / 0.75;

  var topOffset = evenOffsets[1][1] * y_unit;
  const latStart = lat_start - topOffset;

  // diff here
  const nRows = height + 1;

  var coords: Position[] = [];
  for (let row = 0; row < nRows; row++) {
    let lon_offset = row % 2 === 0 ? 0.5 * x_unit : 0;

    let start: Position = [
      lon_offset + lon_start,
      latStart - y_unit * 0.75 * row,
    ];

    // diff here
    coords = coords.concat([start]);

    for (let col = 0; col < width; col++) {
      // diff here
      const hex = createPeak(start, x_unit, y_unit, row % 2 === 1);

      coords = coords.concat(hex);
      start = [start[0] + x_unit, start[1]];
    }
  }

  return coords;
}
