import { RawRiverSystem, RiverEndpoints, RiverNodes } from "./types";
import { Graph } from "graphlib";

const createEdges = (riverSystem: RawRiverSystem, graph: Graph) => {
  for (const [row, col] of riverSystem.pairs()) {
    for (const i of [-1, 1]) {
      for (const j of [-1, 1]) {
        const otherRow = row + i;
        const otherCol = col + j;

        if (riverSystem.get(row + i, col + j))
          graph.setEdge(`${row},${col}`, `${otherRow},${otherCol}`);
      }
    }
  }
};

const createNodes = (riverSystem: RawRiverSystem, graph: Graph) => {
  let i = 0,
    j = 0;
  for (const row of riverSystem.rows()) {
    for (const col of row) {
      if (col) graph.setNode(`${i},${j}`);
      j++;
    }
    i++;
  }
};

// Map tiles -> nodes at the edges of those tiles
const mapToNodes = (riverSystem: RawRiverSystem): RiverNodes => {
  const graph = new Graph({ directed: false });

  createNodes(riverSystem, graph);
  createEdges(riverSystem, graph);

  return graph;
};

export default mapToNodes;
