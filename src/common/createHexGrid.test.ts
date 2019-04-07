import createRawHexGrid, { createHexagon, offsets } from "./createRawHexGrid";

describe("createHexagon", () => {
  it("outputs a hexagon", () => {
    const hex = createHexagon([0, 0], 1);

    expect(hex.coordinates).toEqual([offsets]);
  });
});

describe("createHexGrid", () => {
  const fixtures = [
    {
      width: 7,
      height: 5,
      lon_start: 0,
      lon_end: 100,
      lat_start: 0
    },
    {
      width: 10,
      height: 10,
      lon_start: -71.0863494873047,
      lon_end: -71.03004455566408,
      lat_start: 42.38086519582323
    }
  ];

  for (const config of fixtures) {
    const grid = createRawHexGrid(config);
    const { width: m, height: n, lon_end, lon_start, lat_start } = config;
    const unit = (lon_end - lon_start) / m;

    it("outputs a grid with nxm elements", () => {
      expect(grid.length).toEqual(m * n);
    });

    it("odd rows are offset by .5 unit length", () => {
      for (let i = 0; i < n; i += 2 * m) {
        expect(grid[i].coordinates[0][0][0]).toEqual(lon_start + unit * 0.5);
      }
    });

    it("last elem of each row reaches lon_end (if odd row)", () => {
      for (let i = 2 * m - 1; i < m * n; i += 2 * m) {
        expect(grid[i].coordinates[0][3][0]).toBeCloseTo(lon_end, 3);
      }
    });

    it("elems on the top row are on lat_start", () => {
      for (let i = 0; i < m; i++) {
        expect(grid[i].coordinates[0][0][1]).toEqual(lat_start);
      }
    });
  }
});
