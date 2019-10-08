import { RawRiverSystem, RiverEndpoints, RiverNodes } from "./types";
import { Graph } from "graphlib";

// Map tiles -> nodes at the edges of those tiles
const mapToNodes = (riverSystem: RawRiverSystem): RiverNodes => {
  const graph = new Graph({ directed: false });

  let i = 0,
    j = 0;

  for (const row of riverSystem.rows()) {
    for (const col of row) {
      if (col) graph.setNode(`${i},${j}`);
      j++;
    }
    i++;
  }

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

  return graph;
};

export default mapToNodes;
