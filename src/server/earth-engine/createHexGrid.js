import ee from "@google/earthengine";

export default function(args) {
  const rawGrid = createRawHexGrid(args);
  const polys = rawGrid.map((hex, i) =>
    ee.Feature(ee.Geometry.Polygon(hex), {
      label: i
    })
  );
  var grid = ee.FeatureCollection(polys);

  return grid;
}

export function createRawHexGrid({
  width,
  height,
  lon_start,
  lon_end,
  lat_start
}) {
  // lock aspect ratio to width
  var unit = (lon_end - lon_start) / width;

  var polys = [];
  // for each row
  for (let row = 0; row < height; row++) {
    let lon_offset = row % 2 == 0 ? 0.5 * unit : 0;

    let start = [lon_offset + lon_start, 0.25 + lat_start + unit * 0.75];

    // for each col
    for (let col = 0; col < width; col++) {
      const hex = createHexagon(start, unit);

      polys.push(hex);
      start = [start[0] + unit, start[1]];
    }
  }

  return polys;
}

export function addOffsets(offsets, start, unit) {
  const [sa, sb] = start;
  return offsets.map(offset => {
    const [a, b] = offset;
    return [sa + a * unit, sb + b * unit];
  });
}

export const offsets = [
  // lng, lat
  [0, 0],
  [0.5, 0.5],
  [1, 0],
  [1, -0.5],
  [0.5, -0.75],
  [0, -0.5],
  [0, 0]
];

export function createHexagon(start, unit) {
  return addOffsets(offsets, start, unit);
}
