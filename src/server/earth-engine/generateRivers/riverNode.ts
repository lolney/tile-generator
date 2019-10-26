import { RiverNode, RiverEdge, VertexType } from "./types";
import { RiverType } from "../../../common/types";

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
const oddRowFirst = [1, 2];

const mod = (n: number, divisor: number) => {
  const mod = n % divisor;
  return mod < 0 ? mod + divisor : mod;
};

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
    1: [[row - 1, col + colOffset + 1, 2], [row, col + 1, 0]],
    2: [[row, col + 1, 3], [row + 1, col + colOffset + 1, 1]],
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
    case "0,2":
      return "northEast";
    case "0,5":
    case "1,5":
      return "northWest";
    case "1,2":
    case "1,3":
      return "east";
    case "4,5":
    case "3,5":
      return "west";
    case "2,3":
    case "1,3":
      return "southEast";
    case "3,4":
    case "2,4":
      return "southWest";
    default:
      throw new Error(`unexpected riverNode key: ${key}`);
  }
};

// even rows: do 0 - 3. 0--5 on first col
// odd rows: do 1-2 on first col
export const fromCoords = (row: number, col: number): RiverNode[] => {
  let nodeIndices;
  if (row % 2 === 0) {
    nodeIndices = col === 0 ? evenRowFirst : evenRow;
  } else {
    nodeIndices = col === 0 ? oddRowFirst : [];
  }
  return nodeIndices.map(node => `${row},${col},${node}`);
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
    return [otherRow, otherCol, riverNodes(key)];

  return [row, col, riverNodes(key)];
};
