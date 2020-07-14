import { range } from "lodash";
import { GridPoints, NextNodes } from "./types";
import { Graph } from "graphlib";
import { Dimensions } from "@tile-generator/common";

export class GridGraph {
  graph: Graph;

  constructor(
    private gridPoints: GridPoints,
    private nextNodes: NextNodes,
    private dimensions: Dimensions
  ) {
    this.graph = new Graph();
  }

  static build(
    gridPoints: GridPoints,
    nextNodes: NextNodes,
    dimensions: Dimensions
  ) {
    const grid = new GridGraph(gridPoints, nextNodes, dimensions);
    grid.createConnections();
    return grid;
  }

  // --- connections --- (points alternate low, high, starting with low on the first row)
  // for each point:
  // if a higher point:
  // connect to up, bottom left, bottom right if they exist
  // if a lower point:
  // connect to down, top left, top right if they exist
  createConnections() {
    const { width, height } = this.dimensions;

    for (const i of range(height + 1)) {
      for (const j of range(width + 1)) {
        const myId = this.nodeId(i, j);
        for (const neighbor of this.neighbors(i, j)) {
          const weight =
            String(this.nextNodes[Number(myId)]) === neighbor
              ? 0
              : Number.POSITIVE_INFINITY;
          this.graph.setEdge(myId, neighbor, weight);
        }
      }
    }
  }

  nodeId(row: number, col: number) {
    if (row < 0 || row >= this.dimensions.height) return;
    if (col < 0 || col >= this.dimensions.width) return;
    return String(row * this.dimensions.width + col);
  }

  neighbors(row: number, col: number) {
    if (this.isLowerPoint(row, col))
      return [
        this.nodeId(row + 1, col),
        this.nodeId(row, col - 1),
        this.nodeId(row, col + 1),
      ].filter((e) => e);
    else
      return [
        this.nodeId(row - 1, col - 1),
        this.nodeId(row, col - 1),
        this.nodeId(row, col + 1),
      ].filter((e) => e);
  }

  isLowerPoint(row: number, col: number) {
    if (row % 2 == 0) {
      return col % 2 == 0;
    }
    return col % 2 === 1;
  }
}
