import { Polygon, LineString, Position } from "geojson";
import { RiverType } from "../types";
import { calcUnit, addOffsets } from "./common";

export type params = {
  width: number;
  height: number;
  lon_start: number;
  lon_end: number;
  lat_start: number;
  lat_end: number;
};

/**
 *
 * @param params.lat_start: latitude at the northern end of the bounding boxes
 */
export function createRawHexGrid({
  width,
  height,
  lon_start,
  lon_end,
  lat_start,
  lat_end,
}: params): Polygon[] {
  var x_unit = calcUnit(lon_start, lon_end, width);
  const y_unit = calcUnit(lat_end, lat_start, height) / 0.75;

  var topOffset = offsets[1][1] * y_unit;
  const latStart = lat_start - topOffset;

  var polys = [];
  // for each row, starting at the top (highest latitude)
  for (let row = 0; row < height; row++) {
    // Offset to the right if even row
    let lon_offset = row % 2 === 0 ? 0.5 * x_unit : 0;

    let start: Position = [
      lon_offset + lon_start,
      latStart - y_unit * 0.75 * row,
    ];

    // for each col
    for (let col = 0; col < width; col++) {
      const hex = createHexagon(start, x_unit, y_unit);

      polys.push(hex);
      start = [start[0] + x_unit, start[1]];
    }
  }

  return polys;
}

export const offsets: Position[] = [
  // lng, lat
  [0, 0],
  [0.5, 0.25], // north
  [1, 0], // northeast
  [1, -0.5], // southeast
  [0.5, -0.75], // south
  [0, -0.5], // southwest
  [0, 0], // northwest
];

export const mapRiverToLine = (
  poly: Polygon,
  river: keyof RiverType
): LineString => {
  const index = {
    northWest: 0,
    northEast: 1,
    east: 2,
    southEast: 3,
    southWest: 4,
    west: 5,
  }[river];
  const coordinates = poly.coordinates[0].slice(index, index + 2);
  return {
    type: "LineString",
    coordinates,
  };
};

export function createHexagon(
  start: Position,
  x_unit: number,
  y_unit: number
): Polygon {
  return {
    type: "Polygon",
    coordinates: [addOffsets(offsets, start, x_unit, y_unit)],
  };
}
