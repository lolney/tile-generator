import { RawRiverSystem } from "./types";
import { Graph } from "graphlib";
import { pruneNodes } from "./riverNode";
import RiverNodes from "./RiverNodes";
import RiverNode from "./RiverNode_";

const createEdges = (riverSystem: RawRiverSystem, graph: Graph) => {
  for (const node of graph.nodes()) {
    const connections = RiverNode.getConnections(node, riverSystem);
    connections.forEach((connection) =>
      graph.setEdge(node, connection).setEdge(connection, node)
    );
  }
};

const createNodes = (riverSystem: RawRiverSystem, graph: Graph) => {
  for (const [row, col] of riverSystem.pairs()) {
    const isRiver = riverSystem.get(row, col);
    if (isRiver) {
      RiverNode.fromCoords(row, col).map((node: string) => graph.setNode(node));
    }
  }
  pruneNodes(graph, riverSystem);
};

// Map tiles -> nodes at the edges of those tiles
const mapToNodes = (riverSystem: RawRiverSystem): RiverNodes => {
  const graph = new Graph({ directed: true });

  createNodes(riverSystem, graph);
  createEdges(riverSystem, graph);

  return new RiverNodes(graph, riverSystem.width, riverSystem.height);
};

export default mapToNodes;
