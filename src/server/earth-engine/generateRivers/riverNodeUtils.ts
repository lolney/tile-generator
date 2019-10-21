import { RiverNode, RiverEdge } from "./types";

/*
         0
         -\
       /-  -\
     /-      -\              
 5 /-          -\ 1
  -              -
  |              |
  |              |
  |              |
  |              |
 4-              -2
   \-          -/
     \-      -/
       \-  -/
         \/
          3                             
*/

const evenRow = [0, 1, 2, 3];
const evenRowFirst = [0, 1, 2, 3, 4, 5];
const oddRowFirst = [1, 2];

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

export const getConnections = () => {};

export const tileIndexFromEdge = (edge: RiverEdge) => {
  const [node0, node1] = edge;
  const [row, col, index0] = node0.split(",");
  const [, index1] = node1.split(",");

  const key = [index0, index1].sort().join(",");

  return [node0, node1, riverNodes(key)];
};
