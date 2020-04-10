import { json } from "graphlib";
import RiverNodes from "../RiverNodes";
import fs from "fs";
import RiverNode from "../RiverNode_";
import GraphPrinter from "./GraphPrinter";

export default class GraphDebuger {
  graph: RiverNodes;

  constructor(graph: RiverNodes) {
    this.graph = graph;
  }

  print(source?: RiverNode, end?: RiverNode) {
    new GraphPrinter(this.graph, source, end).print();
  }

  writeToFile() {
    fs.writeFileSync(
      `/Users/lolney/Downloads/graph-${Math.random()}.json`,
      JSON.stringify(json.write(this.graph.graph)),
      {
        flag: "w"
      }
    );
  }
}
