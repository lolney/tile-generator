import { alg, json, Edge, Graph } from "graphlib";
import { NodeId } from "./types";
import fs from "fs";

const findSource = (graph: Graph) => graph.nodes()[0];

const findBranchesToPrune = (graph: Graph): Edge[] => {
  const explore = (predecessor: NodeId | undefined, node: NodeId) => {
    const neighbors = graph.neighbors(node);

    if (!neighbors) return;

    if (neighbors.length === 1 && neighbors[0] === predecessor)
      toPrune.push({ v: predecessor, w: node });

    neighbors.filter(id => id !== predecessor).forEach(id => explore(node, id));
  };

  const source: NodeId = findSource(graph);
  const toPrune: Edge[] = [];

  explore(undefined, source);

  return toPrune;
};

const pruneBranches = (graph: Graph, branches: Edge[]) => {
  for (const branch of branches) {
    graph.removeEdge(branch);
  }
  return graph;
};

// Find minimum spanning tree, then prune 1-edge branches
const findRiverNetwork = (graph: Graph): Graph => {
  fs.writeFile(
    "~/Downloads/graph.json",
    JSON.stringify(json.write(graph)),
    {
      flag: "w"
    },
    () => {}
  );
  const mst = alg.prim(graph, e => 1);

  const branches = findBranchesToPrune(mst);
  return pruneBranches(graph, branches);
};

export default findRiverNetwork;
