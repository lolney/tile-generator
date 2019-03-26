import { Polygon } from "geojson";

type coords = [number, number];
type params = {
  width: number;
  height: number;
  lon_start: number;
  lon_end: number;
  lat_start: number;
};

export default function createRawHexGrid({
  width,
  height,
  lon_start,
  lon_end,
  lat_start
}: params): Polygon[] {
  // lock aspect ratio to width
  var unit = (lon_end - lon_start) / width;

  var polys = [];
  // for each row
  for (let row = 0; row < height; row++) {
    let lon_offset = row % 2 == 0 ? 0.5 * unit : 0;

    let start: coords = [
      lon_offset + lon_start,
      0.25 + lat_start + unit * 0.75 * row
    ];

    // for each col
    for (let col = 0; col < width; col++) {
      const hex = createHexagon(start, unit);

      polys.push(hex);
      start = [start[0] + unit, start[1]];
    }
  }

  return polys;
}

export function addOffsets(offsets: coords[], start: coords, unit: number) {
  const [sa, sb] = start;
  return offsets.map(offset => {
    const [a, b] = offset;
    return [sa + a * unit, sb + b * unit];
  });
}

export const offsets: coords[] = [
  // lng, lat
  [0, 0],
  [0.5, 0.25],
  [1, 0],
  [1, -0.5],
  [0.5, -0.75],
  [0, -0.5],
  [0, 0]
];

export function createHexagon(start: coords, unit: number): Polygon {
  return {
    type: "Polygon",
    coordinates: [addOffsets(offsets, start, unit)]
  };
}
