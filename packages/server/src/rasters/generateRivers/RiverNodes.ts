import { Graph } from "graphlib";
import { TilesArray } from "@tile-generator/common";
import RiverNode from "./RiverNode_";

export default class RiverNodes {
  graph: Graph;
  width: number;
  height: number;

  constructor(graph: Graph, width: number, height: number) {
    this.graph = graph;
    this.width = width;
    this.height = height;
  }

  nodes = () => this.graph.nodes().map((node) => new RiverNode(node));

  toTilesArray() {
    const coords = this.graph.nodes().map(RiverNode.toCoords);
    const array = TilesArray.fromDimensions(
      this.width,
      this.height,
      false
    ) as TilesArray<boolean>;

    for (const [x, y] of coords) {
      array.set(x, y, true);
    }

    return array;
  }
}
