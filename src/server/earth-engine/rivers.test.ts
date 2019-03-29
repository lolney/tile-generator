import { Polygon } from "geojson";
import { getRivers, getTiles } from "./rivers";

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

  expect(rivers.length).toBeGreaterThan(0);
  expect(rivers.find(river => river.name === "Salinas")).toBeDefined();

  expect(rivers[0].gid).toBeDefined();
  expect(rivers[0].name).toBeDefined();
  expect(rivers[0].geom).toBeDefined();
  console.log(rivers[0].geom);
  expect(rivers[0].geom.coordinates).toBeDefined();
});

it("getTiles finds poly that intersect with river segements", async () => {
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
