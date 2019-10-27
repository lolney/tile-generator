import { RawRiverSystem, RiverNodes } from "./types";
import { Graph } from "graphlib";
import { fromCoords, getConnections, pruneNodes } from "./riverNode";

const createEdges = (riverSystem: RawRiverSystem, graph: Graph) => {
  for (const node of graph.nodes()) {
    const connections = getConnections(
      node,
      riverSystem.width,
      riverSystem.height
    );
    connections.forEach(connection => graph.setEdge(node, connection));
  }
};

const createNodes = (riverSystem: RawRiverSystem, graph: Graph) => {
  for (const [row, col] of riverSystem.pairs()) {
    const isRiver = riverSystem.get(row, col);
    if (isRiver) {
      if (row == 8 && col == 6)
        Array.from(riverSystem.neighbors(row, col)).map(neighbor =>
          console.log(neighbor, riverSystem.get(...neighbor))
        );
      fromCoords(row, col, riverSystem.height).map((node: string) =>
        graph.setNode(node)
      );
    }
  }
  pruneNodes(graph, riverSystem);
};

// Map tiles -> nodes at the edges of those tiles
const mapToNodes = (riverSystem: RawRiverSystem): RiverNodes => {
  const graph = new Graph({ directed: false });

  createNodes(riverSystem, graph);
  createEdges(riverSystem, graph);

  return graph;
};

export default mapToNodes;
