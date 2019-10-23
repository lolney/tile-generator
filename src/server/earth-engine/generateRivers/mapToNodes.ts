import { RawRiverSystem, RiverNodes } from "./types";
import { Graph } from "graphlib";
import { fromCoords, getConnections } from "./riverNode";

// todo: not sure what this is doing. should create a node for each corner of the hex tile.
// or should this be at the mapToTiles stage?

const createEdges = (graph: Graph) => {
  for (const node of graph.nodes()) {
    const connections = getConnections(node);
    connections.forEach(connection => graph.setEdge(node, connection));
  }
};

const createNodes = (riverSystem: RawRiverSystem, graph: Graph) => {
  for (const [row, col] of riverSystem.pairs()) {
    const isRiver = riverSystem.get(row, col);
    if (isRiver)
      fromCoords(row, col).map((node: string) => graph.setNode(node));
  }
};

// Map tiles -> nodes at the edges of those tiles
const mapToNodes = (riverSystem: RawRiverSystem): RiverNodes => {
  const graph = new Graph({ directed: false });

  createNodes(riverSystem, graph);
  createEdges(graph);

  return graph;
};

export default mapToNodes;
