import { RiverNode, RiverEdge, VertexType, RawRiverSystem } from "./types";
import { RiverType } from "../../../common/types";
import { Graph } from "graphlib";

/* 
The corresponding vertex number on each neighbor

       2----0----4
    3       -\       3
    |     /-  -\     |
    |   /-      -\   |           
1---5 /-          -\ 1 ---- 5
     -              -
     |              |
     |              |
     |              |
     |              |
2---4-              -2  --- 4
    | \-          -/ |
    |   \-      -/   |
    0     \-  -/     0
            \/
       1----3----5                            
*/

type Neighbors = [number, number, number][];

const evenRow = [0, 1, 2, 3];
const evenRowFirst = [0, 1, 2, 3, 4, 5];
const oddRowFirst = [4, 5];
const oddRowLastRow = [2, 3];

const mod = (n: number, divisor: number) => {
  const mod = n % divisor;
  return mod < 0 ? mod + divisor : mod;
};

// Map a vertex on one hex to neighboring vertices both on itself and its neighbors
// Only need to map 1-3, because 0,4,5 have their connections set by the neighbor
const mapVertexToNeighbors = (
  row: number,
  col: number,
  vertex: VertexType
): Neighbors => {
  // odd rows are shifted to the left
  const colOffset = row % 2 === 0 ? 0 : -1;

  const otherMap: {
    [P in number]: Neighbors;
  } = {
    0: [],
    1: [
      [row - 1, col + colOffset, 2], // top left
      [row, col + 1, 0], // right
      // needed for odd rows.
      // might not actually be on the hex described?
      [row + 1, col + colOffset + 1, 0], // bottom right
      [row - 1, col + colOffset + 1, 4]
      // 1,4 right should never exist, because 4 will be pruned
    ],
    2: [
      [row, col + 1, 3], // right
      [row + 1, col + colOffset + 1, 5], // bottom right
      [row + 1, col + colOffset, 1] // bottom left
      // 2,5 right should never exist, because 5 will be pruned
    ],
    3: [
      [row + 1, col + colOffset + 1, 4],
      [row, col + 1, 4],
      [row + 1, col + colOffset, 2],
      [row + 1, col + colOffset, 0],
      [row + 1, col + colOffset + 1, 0]
    ],
    4: [],
    5: []
  };

  const selfMap = (vertex: VertexType): Neighbors => [
    [row, col, mod(vertex + 1, 6)],
    [row, col, mod(vertex - 1, 6)]
  ];

  return [...otherMap[vertex], ...selfMap(vertex)];
};

// The second pair for each direction comes from `otherMap` above
// ie, is a neighboring tile
const riverNodes = (key: string) => {
  switch (key) {
    case "0,1":
      return "northEast";
    case "0,5":
      return "northWest";
    case "1,2":
      return "east";
    case "4,5":
      return "west";
    case "2,3":
      return "southEast";
    case "3,4":
      return "southWest";
    default:
      throw new Error(`unexpected riverNode key: ${key}`);
  }
};

const riverNodesOther = (args: {
  rowA: number;
  colA: number;
  rowB: number;
  colB: number;
  vertexA: number;
  vertexB: number;
  key: string;
}): [number, number, keyof RiverType] => {
  let { rowA, colA, rowB, colB, vertexA, key } = args;

  switch (key) {
    case "0,1":
      if (rowA == rowB) {
        return [rowA, Math.max(colA, colB), "northWest"];
      } else {
        return rowA < rowB ? [rowA, colA, "east"] : [rowB, colB, "east"];
      }
    case "1,4":
      return rowA > rowB
        ? [rowA, colA, "northEast"]
        : [rowB, colB, "northEast"];
    case "2,5":
      return rowA > rowB
        ? [rowA, colA, "southEast"]
        : [rowB, colB, "southEast"];
    case "1,2":
      if (vertexA != 2) {
        const tempRow = rowA;
        const tempCol = colA;

        rowA = rowB;
        colA = colB;
        rowB = tempRow;
        colB = tempCol;
      }

      if (rowA % 2 == 0 && colA == colB) return [rowA, colA, "southEast"];
      if (rowA % 2 == 0 && colA < colB) return [rowB, colB, "northEast"];
      if (rowA % 2 == 1 && colA > colB) return [rowB, colB, "southEast"];
      if (rowA % 2 == 1 && colA == colB) return [rowB, colB, "northEast"];

      break;

    case "2,3":
      if (rowA == rowB) {
        return [rowA, Math.max(colA, colB), "southWest"];
      } else {
        return rowA > rowB ? [rowA, colA, "east"] : [rowB, colB, "east"];
      }
    case "0,3":
      if (vertexA != 3) {
        const tempRow = rowA;
        const tempCol = colA;

        rowA = rowB;
        colA = colB;
        rowB = tempRow;
        colB = tempCol;
      }

      if (rowA % 2 == 0 && colA == colB) return [rowA, colA, "southWest"];
      if (rowA % 2 == 0 && colA < colB) return [rowA, colA, "southEast"];
      if (rowA % 2 == 1 && colA > colB) return [rowA, colA, "southWest"];
      if (rowA % 2 == 1 && colA == colB) return [rowA, colA, "southEast"];

      break;
    case "3,4":
      if (rowA == rowB) {
        return [rowA, Math.min(colA, colB), "southEast"];
      } else {
        return [Math.max(rowA, rowB), Math.max(colA, colB), "west"];
      }
  }

  throw new Error(
    `unexpected key ${key} with coords ${rowA},${colA} ${rowB},${colB}`
  );
};

export const fromCoords = (row: number, col: number): RiverNode[] => {
  const nodeIndices = Array(6)
    .fill(0)
    .map((_, i) => i);
  return nodeIndices.map(node => `${row},${col},${node}`);
};

const removeNodes = (
  graph: Graph,
  row: number,
  col: number,
  vertices: number[]
) => {
  vertices.forEach(vertex => graph.removeNode(`${row},${col},${vertex}`));
};

// Remove edges are that duplicated on another hex
// Only remove them from your own hex
// Even rows: get rid of the left side
// Odd row: get rid of anything but the right side
export const pruneNodes = (graph: Graph, riverSystem: RawRiverSystem) => {
  for (const [row, col] of riverSystem.pairs()) {
    if (riverSystem.leftValue(row, col)) removeNodes(graph, row, col, [4, 5]);

    if (row % 2 == 1) {
      if (riverSystem.topRightValue(row, col))
        removeNodes(graph, row, col, [0, 1]);
      if (riverSystem.topLeftValue(row, col))
        removeNodes(graph, row, col, [5, 0]);
      if (riverSystem.bottomRightValue(row, col))
        removeNodes(graph, row, col, [2, 3]);
      if (riverSystem.bottomLeftValue(row, col))
        removeNodes(graph, row, col, [3, 4]);
    }
  }
};

export const toCoords = (node: RiverNode) => {
  const [row, col, vertex] = node.split(",");
  return [parseInt(row), parseInt(col), parseInt(vertex)];
};

export const getConnections = (
  node: RiverNode,
  width: number,
  height: number
): string[] => {
  const [row, col, vertex] = toCoords(node);
  const neighbors = mapVertexToNeighbors(row, col, vertex as VertexType);

  const inBounds = (row: number, col: number) =>
    row >= 0 && row < height && col >= 0 && col < height;

  return neighbors
    .map(([nextRow, nextCol, nextVertex]) =>
      inBounds(nextRow, nextCol) ? `${nextRow},${nextCol},${nextVertex}` : ""
    )
    .filter(x => x);
};

export const tileIndexFromEdge = (
  edge: RiverEdge
): [number, number, keyof RiverType] => {
  const [node0, node1] = edge;
  const [rowA, colA, vertexA] = toCoords(node0);
  const [rowB, colB, vertexB] = toCoords(node1);

  const key = [vertexA, vertexB].sort().join(",");

  if (rowA !== rowB || colA !== colB)
    return riverNodesOther({ rowA, colA, rowB, colB, vertexA, vertexB, key });

  return [rowA, colB, riverNodes(key)];
};
