import { RawRiverSystem, VertexType } from "./types";
import { mapVertexToNeighbors } from "./riverNode";

export default class RiverNode {
  node: string;

  constructor(node: string) {
    this.node = node;
  }

  toCoords = () => RiverNode.toCoords(this.node);

  static toCoords = (node: string) => {
    const [row, col, vertex] = node.split(",");
    return [parseInt(row), parseInt(col), parseInt(vertex)];
  };

  static fromCoords = (row: number, col: number): string[] => {
    const nodeIndices = Array(6)
      .fill(0)
      .map((_, i) => i);
    return nodeIndices.map((node) => `${row},${col},${node}`);
  };

  static getConnections = (
    node: string,
    riverSystem: RawRiverSystem
  ): string[] => {
    const [row, col, vertex] = RiverNode.toCoords(node);
    const neighbors = mapVertexToNeighbors(row, col, vertex as VertexType);

    const inBounds = (row: number, col: number) =>
      row >= 0 &&
      row < riverSystem.height &&
      col >= 0 &&
      col < riverSystem.height;

    return neighbors
      .map(([nextRow, nextCol, nextVertex]) =>
        inBounds(nextRow, nextCol) && riverSystem.get(nextRow, nextCol)
          ? `${nextRow},${nextCol},${nextVertex}`
          : ""
      )
      .filter((x) => x);
  };
}
