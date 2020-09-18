import { merge } from "lodash";
import { Graph } from "graphlib";
import { Tile, Dimensions } from "@tile-generator/common";
import { GridGraph } from "./GridGraph";
import { RiverDirection } from "./types";

/**
 * We start with a grid of nodes, connected by edges
 * Convert those to the final representation: a tile, containing a river
 */
export const mapGraphToTiles = (
  graph: Graph,
  dimensions: Dimensions
): Tile[] => {
  const tiles: Tile[] = Array(dimensions.height * dimensions.height)
    .fill(undefined)
    .map(() => ({}));

  for (const nodeId of graph.nodes()) {
    const node = GridGraph.positionFromNodeId(nodeId, dimensions);

    const edges = graph.outEdges(nodeId);

    if (!edges) continue;

    for (const edge of edges) {
      console.log(edge);

      const neighbor = GridGraph.positionFromNodeId(edge.w, dimensions);
      const mapping = mapConnectionToSide(dimensions, node, neighbor);

      if (mapping) {
        const { index, tile } = mapping;
        tiles[index] = merge(tile, tiles[index]);
      }
    }
  }
  return [];
};

const mapConnectionToSide = (
  dimensions: Dimensions,
  self: { row: number; col: number },
  neighbor: { row: number; col: number }
) => {
  const isDown = GridGraph.isLowerPoint(self.row, self.col);

  const getNode = (direction: RiverDirection) =>
    GridGraph.nodeIndexFromPosition(dimensions, self, direction);

  if (isDown) {
    if (neighbor.row > self.row) {
      return getNode("south");
    }
    if (neighbor.col < self.col) {
      return getNode("west");
    }
    if (neighbor.col > self.col) return getNode("east");
  } else {
    if (neighbor.row < self.row) {
      return getNode("north");
    }
    if (neighbor.col < self.col) {
      return getNode("west");
    }
    if (neighbor.col > self.col) return getNode("east");
  }

  const graph = new GridGraph(dimensions);

  throw new Error(
    `
      Invalid edge: from ${JSON.stringify(self)} to ${JSON.stringify(neighbor)}
      Node IDs: ${graph.nodeId(self.row, self.col)}, ${graph.nodeId(
      neighbor.row,
      neighbor.col
    )}
    `
  );
};
