import { fromPairs, range } from "lodash";
import { GridGraph } from "../GridGraph";

test("GridGraph", () => {
  const width = 10;
  const height = 10;
  const graph = GridGraph.build({ width, height });

  expect(graph.nodes()).toHaveLength(121);
  expect(graph.edgeCount()).toBeLessThan(121 * 3);
});

test.each(["1", "10", "11", "42"])(
  "positionFromNodeId for nodeId %p",
  (nodeId) => {
    const width = 10;
    const height = 10;
    const graph = new GridGraph({ width, height });

    const { row, col } = GridGraph.positionFromNodeId(nodeId, {
      width,
      height,
    });
    const result = graph.nodeId(row, col);

    expect(nodeId).toEqual(result);
  }
);
