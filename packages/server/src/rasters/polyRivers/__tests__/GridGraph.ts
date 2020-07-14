import { GridGraph } from "../GridGraph";

test("GridGraph", () => {
  const width = 10;
  const height = 10;
  const graph = GridGraph.build({ width, height });

  expect(graph.nodes()).toHaveLength(121);
  expect(graph.edgeCount()).toBeLessThan(121 * 3);
});
