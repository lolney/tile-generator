import { RawRiverSystem, RiverEndpoints, RiverNodes } from "./types";
import { Graph } from "graphlib";

// todo: not sure what this is doing. should create a node for each corner of the hex tile.
// or should this be at the mapToTiles stage?

const createEdges = (riverSystem: RawRiverSystem, graph: Graph) => {
  for (const [row, col] of riverSystem.pairs()) {
    for (const [i, j] of riverSystem.neighbors(row, col)) {
      if (riverSystem.get(i, j)) graph.setEdge(`${row},${col}`, `${i},${j}`);
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
