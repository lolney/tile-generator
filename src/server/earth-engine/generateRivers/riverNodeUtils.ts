import { RiverNode, RiverEdge, VertexType } from "./types";

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

type NeighborPair = [[number, number, number], [number, number, number]];

const evenRow = [0, 1, 2, 3];
const evenRowFirst = [0, 1, 2, 3, 4, 5];
const oddRowFirst = [1, 2];

const mapVertexToNeighbors = (
  row: number,
  col: number,
  vertex: VertexType
): NeighborPair => {
  const colOffset = row % 2 === 0 ? 0 : -1;

  const map: {
    [P in number]: NeighborPair;
  } = {
    0: [[row - 1, col + colOffset, 2], [row - 1, col + colOffset + 1, 4]],
    1: [[row - 1, col + colOffset + 1, 3], [row, col + 1, 5]],
    2: [[row, col + 1, 4], [row + 1, col + colOffset + 1, 0]],
    3: [[row + 1, col + colOffset + 1, 5], [row + 1, col + colOffset, 1]],
    4: [[row + 1, col + colOffset, 0], [row, col - 1, 2]],
    5: [[row, col - 1, 1], [row - 1, col + colOffset, 3]]
  };

  return map[vertex];
};

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

export const getConnections = (node: RiverNode): string[] => {
  const [row, col, vertex] = toCoords(node);
  const neighbors = mapVertexToNeighbors(row, col, vertex as VertexType);

  return neighbors.map(
    ([nextRow, nextCol, nextVertex]) => `${nextRow},${nextCol},${nextVertex}`
  );
};

export const tileIndexFromEdge = (edge: RiverEdge) => {
  const [node0, node1] = edge;
  const [row, col, index0] = toCoords(node0);
  const [, index1] = toCoords(node1);

  const key = [index0, index1].sort().join(",");

  return [row, col, riverNodes(key)];
};
