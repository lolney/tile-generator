import createRawHexGrid, { createHexagon, offsets } from "./createRawHexGrid";

describe("createHexagon", () => {
  it("outputs a hexagon", () => {
    const hex = createHexagon([0, 0], 1);

    expect(hex.coordinates).toEqual([offsets]);
  });
});

describe("createHexGrid", () => {
  const m = 7;
  const n = 5;
  const grid = createRawHexGrid({
    width: m,
    height: n,
    lon_start: 0,
    lon_end: 100,
    lat_start: 0
  });

  const unit = 100 / m;

  it("outputs a grid with nxm elements", () => {
    expect(grid.length).toEqual(m * n);
  });

  it("odd rows are offset by .5 unit length", () => {
    for (let i = 1; i < n; i += 2 * m) {
      expect(grid[i].coordinates[0][0][0]).toEqual(unit * 0.5);
    }
  });

  it("last elem of each row reaches lon_end", () => {
    for (let i = m - 1; i < n; i += m) {
      expect(grid[i].coordinates[3][0][0]).toEqual(100);
    }
  });
});
