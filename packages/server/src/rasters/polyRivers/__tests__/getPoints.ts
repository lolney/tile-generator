import { range } from "lodash";
import { getPoints } from "../getPoints";

test("getPoints", () => {
  const rivers = range(10)
    .map((i) => ({
      id: String(i),
      basinId: String(i),
      upstreamId: i > 0 ? String(i - 1) : undefined,
      downstreamId: i < 9 ? String(i - 1) : undefined,
      geom: {
        type: "LineString" as "LineString",
        coordinates: range(10).map((j) => [i, j]),
      },
    }))
    .flat(1);

  const { endpointIds, points, nextPoints } = getPoints(rivers);
  const nextKeys = Object.keys(nextPoints);

  expect(Object.keys(points)).toHaveLength(100);
  for (const key of nextKeys.slice(0, -1)) {
    expect(nextPoints[key]).toBeDefined();
  }
  expect(nextPoints[nextKeys[99]]).toBeUndefined();
  expect(endpointIds).toEqual(["0,0"]);
});
