import { Graph } from "graphlib";
import { RiversArray } from "./RiversArray";
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

  nodes = () => this.graph.nodes().map(node => new RiverNode(node));

  toRiversArray() {
    const coords = this.graph.nodes().map(RiverNode.toCoords);
    const array = RiversArray.fromDimensions(
      this.width,
      this.height,
      false
    ) as RiversArray<boolean>;

    for (const [x, y] of coords) {
      array.set(x, y, true);
    }

    return array;
  }
}
