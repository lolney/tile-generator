import { Polygon } from "geojson";
import {
  getRivers,
  getTiles,
  getEdges,
  polyIntersection,
  determineEndNode,
  findClosestNode,
  _mapRiversToEdges,
  River
} from "./rivers";
import { createHexagon } from "../../common/createRawHexGrid";

const bounds: Polygon = {
  type: "Polygon",
  coordinates: [[[-120, 35], [-120, 40], [-122, 40], [-122, 35], [-120, 35]]]
};

const bounds2: Polygon = {
  type: "Polygon",
  coordinates: [[[-120, 25], [-120, 30], [-122, 30], [-122, 25], [-120, 25]]]
};

it("getRivers finds rivers within bounds", async () => {
  const rivers = await getRivers(bounds);

  expect(rivers.length).toBeGreaterThanOrEqual(0);
  expect(rivers.find(river => river.name === "Salinas")).toBeDefined();

  expect(rivers[0].name).toBeDefined();
  expect(rivers[0].geom).toBeDefined();
  expect(rivers[0].geom.coordinates).toBeDefined();
});

it("getTiles finds poly that intersects with river segements", async () => {
  const rivers = await getRivers(bounds);

  const river = rivers[0];
  const polys = await getTiles(river, [bounds2, bounds]);

  expect(polys.length).toBeGreaterThan(0);
  expect(river.geom.coordinates[0].length).toBeGreaterThanOrEqual(polys.length);

  for (const poly of polys) expect(poly.id).toBe(1);
});

it("getTiles doesn't find polys that don't intersect", async () => {
  const rivers = await getRivers(bounds);

  const river = rivers[0];
  const polys = await getTiles(river, [bounds2]);

  expect(polys.length).toBe(0);
});

it("getTiles works with hex grid", async () => {});

describe("getEdges", () => {
  const base = createHexagon([0, 0], 1, 1);
  let tiles = [
    { id: 0, geometry: base, rivers: [] as River[] },
    {
      id: 0,
      geometry: createHexagon(<[number, number]>base.coordinates[0][4], 1, 1),
      rivers: [] as River[]
    }
  ];

  it("polyIntersection", () => {
    const [a, b] = polyIntersection(
      tiles[1].geometry,
      tiles[0].geometry
    ).sort();

    expect(a).toBe(3);
    expect(b).toBe(4);
  });

  it("works for two adjacent tiles", async () => {
    const result = await getEdges(tiles);

    expect(result).toHaveLength(2);
    expect(result[0].tile.river).toHaveProperty("west");
    expect(result[0].tile.river).toHaveProperty("southWest");
  });

  it("determineEndNode", () => {
    const result = determineEndNode(0, [3, 4]);

    expect(result).toBe(4);
  });
});

describe("findClosestNode", () => {
  it("finds a node that's right on", async () => {
    const node = await findClosestNode(bounds, [-120, 35]);
    expect(node).toBe(0);
  });

  it("finds a node that's close", async () => {
    const node = await findClosestNode(bounds, [-122, 41]);
    expect(node).toBe(2);
  });
});

describe("mapRiversToEdges", () => {
  it("creates an empty river if only river is closest to node 0", async () => {
    const river = await _mapRiversToEdges(
      bounds,
      [<[number, number]>bounds.coordinates[0][0]],
      0
    );

    expect(river).toEqual({});
  });

  it("if only one river R, create a river to point closest to R", async () => {
    const river = await _mapRiversToEdges(
      bounds,
      [<[number, number]>bounds.coordinates[0][1]],
      0
    );

    expect(river).toEqual({ northWest: true });
  });

  it("with multiple rivers, choose the furthest", async () => {
    // create rivers from the coords of the bounds themselves -
    // should stretch around the hex
    const river = await _mapRiversToEdges(
      bounds,
      <[number, number][]>bounds.coordinates[0],
      0
    );

    expect(river).toEqual({ east: true, northEast: true, northWest: true });
  });
});
