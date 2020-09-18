import { range } from "lodash";
import { NextNodes, RiverDirection } from "./types";
import { Graph } from "graphlib";
import { Dimensions } from "@tile-generator/common";

export class GridGraph {
  graph: Graph;

  constructor(private dimensions: Dimensions) {
    this.graph = new Graph();
  }

  static build(dimensions: Dimensions) {
    const grid = new GridGraph(dimensions);
    grid.createConnections();
    return grid.graph;
  }

  // --- connections --- (points alternate low, high, starting with low on the first row)
  // for each point:
  // if a higher point:
  // connect to up, bottom left, bottom right if they exist
  // if a lower point:
  // connect to down, top left, top right if they exist
  createConnections() {
    const { width, height } = this.dimensions;

    for (const i of range(GridGraph.nRows(height))) {
      for (const j of range(GridGraph.nCols(width))) {
        const myId = this.nodeId(i, j);
        for (const neighbor of this.neighbors(i, j)) {
          const weight = 1;
          this.graph.setEdge(myId, neighbor, weight);
        }
      }
    }
  }

  static nCols = (width: number) => width * 2 + 1;
  static nRows = (height: number) => height + 1;

  nodeId(row: number, col: number) {
    const height = GridGraph.nRows(this.dimensions.height);
    const width = GridGraph.nCols(this.dimensions.width);
    if (row < 0 || row >= height) return;
    if (col < 0 || col >= width) return;
    return String(row * width + col);
  }

  static positionFromNodeId(nodeId: string, dimensions: Dimensions) {
    const height = GridGraph.nRows(dimensions.height);
    const width = GridGraph.nCols(dimensions.width);
    const raw = Number(nodeId);

    return {
      row: Math.floor(raw / width),
      col: raw % width,
    };
  }

  /**
   * From a node row and col and a river direction, get the tile
   */
  static nodeIndexFromPosition(
    dimensions: Dimensions,
    { row, col }: { row: number; col: number },
    direction: RiverDirection
  ) {
    // TODO: does this account for the  1-2-2 pattern??
    const isEvenCol = col % 2 === 0;
    const isEven = row % 2 == 0;

    let nodeCol = Math.floor(col / 2);
    let nodeRow = row;

    let tile = {};

    switch (direction) {
      case "north": // is a tile on the prev row
        nodeRow--;
        tile = {
          river: isEven
            ? { east: true }
            : {
                west: true,
              },
        };
        break;
      case "south": // is the same tile
        tile = {
          river: { west: true },
        };
        break;
      case "east":
        if (row === dimensions.height)
          tile = isEvenCol
            ? {
                river: { southWest: true },
              }
            : {
                river: { southEast: true },
              };
        else
          tile = isEvenCol
            ? {
                river: { northWest: true },
              }
            : {
                river: { northEast: true },
              };
      case "west":
        if (isEvenCol) nodeCol--;
        if (row === dimensions.height)
          tile = isEvenCol
            ? {
                river: { southEast: true },
              }
            : {
                river: { southWest: true },
              };
        else
          tile = isEvenCol
            ? {
                river: { northEast: true },
              }
            : {
                river: { northWest: true },
              };
    }

    if (nodeRow < 0 || nodeRow >= dimensions.height) return undefined;

    return {
      index: nodeRow * dimensions.width + nodeCol,
      tile,
    };
  }

  neighbors(row: number, col: number) {
    // TODO: this doesn't account for the 1-2-2 pattern:
    // one short followed by two long
    const colOffset = row % 2 === 0 ? 1 : 0;
    if (GridGraph.isLowerPoint(row, col))
      return [
        this.nodeId(row + 1, col + colOffset),
        this.nodeId(row, col - 1),
        this.nodeId(row, col + 1),
      ].filter((e) => e);
    else
      return [
        this.nodeId(row - 1, col - 1 + colOffset),
        this.nodeId(row, col - 1),
        this.nodeId(row, col + 1),
      ].filter((e) => e);
  }

  static isLowerPoint(row: number, col: number) {
    if (row % 2 == 0) {
      return col % 2 == 0;
    }
    return col % 2 === 1;
  }
}
