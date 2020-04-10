import { RiverIndex } from "./types";
import { alg } from "graphlib";
import { compact, cloneDeep } from "lodash";
import GraphDebuger from "./debug/GraphDebuger";
import RiverNodes from "./RiverNodes";
import RiverNode from "./RiverNode_";
/*
Alt river algo:
- Find the source (if no source, mark one of the endpoints instead)
- Find each endpoint
- repeat for each endpoint:
    - Find the shortest path from endpoint -> source
    - Mark those edges as cost 0
*/
type Path = ReturnType<typeof alg.dijkstra>;

export default class TraceRivers {
  endpoints: RiverIndex[];
  nodes: RiverNodes;
  source: RiverIndex;
  weightsGraph: RiverNodes;

  constructor(
    nodes: RiverNodes,
    source: RiverIndex | undefined,
    endpoints: RiverIndex[]
  ) {
    this.endpoints = [...endpoints];
    if (!source) source = this.endpoints.pop();
    if (!source || endpoints.length < 1)
      throw new TypeError("source and endpoints must be non-empty");
    this.source = source;
    this.nodes = nodes;
    this.weightsGraph = cloneDeep(nodes);
    for (const edge of this.weightsGraph.graph.edges()) {
      this.weightsGraph.graph.setEdge(edge, 1);
    }
  }

  static perform(
    nodes: RiverNodes,
    source: RiverIndex | undefined,
    endpoints: RiverIndex[]
  ) {
    return new TraceRivers(nodes, source, endpoints).traceRiver();
  }

  findNode = (index: RiverIndex) => {
    const [row, col] = index;
    const candidates = RiverNode.fromCoords(row, col).filter(node =>
      this.nodes.graph.hasNode(node)
    );
    return candidates.length > 0 ? candidates[0] : undefined;
  };

  weightFunction = (v: string) => {
    return this.weightsGraph.graph.outEdges(v);
  };

  updateWeights = (path: Path, end: string, source: string) => {
    const reportError = () => {
      console.error(`Path does not lead to source: ${end}, ${source}`);
    };

    while (end !== source) {
      if (!path[end] || !path[end].predecessor) {
        reportError();
        break;
      }
      const predecessor = path[end].predecessor;
      this.weightsGraph.graph.setEdge(end, predecessor, 0);
      end = predecessor;
    }
  };

  prunedNodes = () => {
    for (const edge of this.weightsGraph.graph.edges()) {
      const label = this.weightsGraph.graph.edge(edge);
      if (label === 1) this.weightsGraph.graph.removeEdge(edge);
    }
    return this.weightsGraph;
  };

  traceRiver(): RiverNodes | undefined {
    const sourceNode = this.findNode(this.source);
    if (!sourceNode) return;
    const endpoints = compact(this.endpoints.map(this.findNode));

    for (const endpoint of endpoints) {
      const path = alg.dijkstra(this.weightsGraph.graph, sourceNode);
      this.updateWeights(path, endpoint, sourceNode);
    }
    console.log("traced river");
    new GraphDebuger(this.weightsGraph).print();
    this.prunedNodes();
    new GraphDebuger(this.weightsGraph).print();
    return this.weightsGraph;
  }
}
