import { range } from "lodash";
import { GridGraph } from "../GridGraph";
import { Pathfinder } from "../pathfind";

test("GridGraph", () => {
  const width = 10;
  const height = 10;
  const nextNodes = {
    "0": 10,
    "120": 111,
  };

  const graph = GridGraph.build({ width, height });
  const newGraph = Pathfinder.pathfind(graph, nextNodes);

  expect(graph.nodes()).toEqual(newGraph.nodes());

  for (const i of range(11, 110)) {
    const result = newGraph.edge(String(i), String(i + 1));
    expect([undefined, 1]).toContain(result);
  }
  for (const i of range(10, 0, -1)) {
    expect(newGraph.edge(String(i), String(i - 1))).toBe(0);
  }
  for (const i of range(111, 119)) {
    expect(newGraph.edge(String(i), String(i + 1))).toBe(0);
  }
});
