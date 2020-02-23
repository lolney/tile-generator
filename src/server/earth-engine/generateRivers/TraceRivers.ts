import { RiverIndex, RiverNodes } from "./types";
import { alg } from "graphlib";
import { compact, cloneDeep, Dictionary, fromPairs } from "lodash";
import { fromCoords } from "./riverNode";
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
    for (const edge of this.weightsGraph.edges()) {
      this.weightsGraph.setEdge(edge.v, edge.w, 1);
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
    const candidates = fromCoords(row, col).filter(node =>
      this.nodes.hasNode(node)
    );
    return candidates.length > 0 ? candidates[0] : undefined;
  };

  weightFunction = (v: string) => {
    return this.weightsGraph.outEdges(v);
  };

  updateWeights = (path: Path, end: string, source: string) => {
    while (end != source) {
      this.weightsGraph.setEdge(end, source, 0);
      end = path[end].predecessor;
    }
  };

  prunedNodes = () => {
    for (const edge of this.weightsGraph.edges()) {
      const label = this.weightsGraph.edge(edge);
      if (label === 1) this.weightsGraph.removeEdge(edge);
    }
    return this.weightsGraph;
  };

  traceRiver(): RiverNodes | undefined {
    const sourceNode = this.findNode(this.source);
    if (!sourceNode) return;
    const endpoints = compact(this.endpoints.map(this.findNode));

    for (const endpoint of endpoints) {
      const path = alg.dijkstra(this.nodes, sourceNode);
      this.updateWeights(path, endpoint, sourceNode);
    }
    return this.prunedNodes();
  }
}
