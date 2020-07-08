import { Position } from "geojson";

export function calcUnit(lon_start: number, lon_end: number, width: number) {
  // lock aspect ratio to width
  var unit = (lon_end - lon_start) / width;
  // Add a buffer of .5 units
  unit = (unit * width) / (width + 0.5);

  return unit;
}

export function addOffsets(
  offsets: Position[],
  start: Position,
  x_unit: number,
  y_unit: number
) {
  const [sa, sb] = start;
  return offsets.map((offset) => {
    const [a, b] = offset;
    return [sa + a * x_unit, sb + b * y_unit];
  });
}
