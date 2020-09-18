import { Graph } from "graphlib";
import { GridGraph } from "../GridGraph";
import { mapGraphToTiles } from "../mapGraphToTiles";
import { Dimensions } from "@tile-generator/common";

const diagonalRiver = (): [Graph, Dimensions] => {
  const dimensions = { width: 3, height: 3 };
  const graph = new GridGraph(dimensions);

  graph.createConnections();

  const edges: Array<[[number, number], [number, number]]> = [
    [
      [0, 0],
      [1, 1],
    ],
    [
      [1, 1],
      [1, 2],
    ],
    [
      [1, 2],
      [2, 2],
    ],
    [
      [2, 2],
      [2, 3],
    ],
    [
      [2, 3],
      [3, 3],
    ],
    [
      [3, 3],
      [3, 4],
    ],
  ];

  for (const [node, neighbor] of edges) {
    const nodeId = graph.nodeId(...node);
    const neighborId = graph.nodeId(...neighbor);

    graph.graph.setEdge(nodeId, neighborId, 0);
  }

  console.log(graph.graph.edges());

  return [graph.graph, dimensions];
};

describe("mapGraphToTiles", () => {
  it("should create diagonal rivers", () => {
    const tiles = mapGraphToTiles(...diagonalRiver());
    expect(tiles).toEqual([]);
  });
});
