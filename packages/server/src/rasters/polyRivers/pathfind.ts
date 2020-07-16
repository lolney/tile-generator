import { cloneDeep } from "lodash";
import { NextNodes } from "./types";
import { alg, Graph } from "graphlib";

type Path = ReturnType<typeof alg.dijkstra>;

export class Pathfinder {
  private graph: Graph;

  constructor(graph: Graph) {
    this.graph = cloneDeep(graph);
  }

  static pathfind = (graph: Graph, nextNodes: NextNodes) => {
    const pathfinder = new Pathfinder(graph);
    for (const [node, nextNode] of Object.entries(nextNodes)) {
      const path = alg.dijkstra(graph, node);
      pathfinder.updateWeights(path, String(nextNode), String(node));
    }
    return pathfinder.graph;
  };

  updateWeights = (path: Path, end: string, source: string) => {
    const reportError = () => {
      console.error(`Path does not lead to source: ${end},${source}`);
    };

    while (end !== source) {
      if (!path[end] || !path[end].predecessor) {
        reportError();
        return;
      }
      const predecessor = path[end].predecessor;
      this.graph.setEdge(end, predecessor, 0);
      end = predecessor;
    }
  };
}
