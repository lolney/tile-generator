import { RiverNode, RiverEdge, VertexType, RawRiverSystem } from "./types";
import { RiverType } from "../../../common/types";
import { Graph } from "graphlib";

/* 
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

// probably need to fill in all the possible connections here, then prune
const mapVertexToNeighbors = (
  row: number,
  col: number,
  vertex: VertexType
): Neighbors => {
  const colOffset = row % 2 === 0 ? 0 : -1;

  const otherMap: {
    [P in number]: Neighbors;
  } = {
    0: [],
    1: [
      [row - 1, col + colOffset + 1, 2],
      [row, col + 1, 0],
      [row + 1, col + colOffset + 1, 0] // needed for odd rows. might not actually be on the hex described?
    ],
    2: [
      [row, col + 1, 3],
      [row + 1, col + colOffset + 1, 5],
      [row + 1, col + colOffset, 1]
    ],
    3: [[row + 1, col + colOffset + 1, 4], [row + 1, col + colOffset, 2]],
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

const riverNodesOther = (key: string) => {
  switch (key) {
    case "0,1": //has conflicts
    case "0,2":
    case "2,3":
      return "northEast";
    case "1,5":
    case "2,5":
      return "northWest";
    case "1,3":
    case "3,4":
      return "east";
    case "3,5":
      return "west";
    case "1,3":
      return "southEast";
    case "1,2":
    case "2,4":
    case "2,3":
      return "southWest";
    default:
      throw new Error(`unexpected riverNode key: ${key}`);
  }
};

export const fromCoords = (
  row: number,
  col: number,
  nRows: number
): RiverNode[] => {
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
  vertices.map(vertex => graph.removeNode(`${row},${col},${vertex}`));
};

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
): [number, number, keyof (RiverType)] => {
  const [node0, node1] = edge;
  const [row, col, index0] = toCoords(node0);
  const [otherRow, otherCol, index1] = toCoords(node1);

  const key = [index0, index1].sort().join(",");

  if (otherRow !== row || otherCol !== col)
    return [otherRow, otherCol, riverNodesOther(key)];

  return [row, col, riverNodes(key)];
};
