import { json } from "graphlib";
import RiverNodes from "../RiverNodes";
import fs from "fs";
import os from "os";
import path from "path";
import RiverNode from "../RiverNode_";
import GraphPrinter from "./GraphPrinter";
import { html } from "./dagre";

export default class GraphDebuger {
  graph: RiverNodes;

  constructor(graph: RiverNodes) {
    this.graph = graph;
  }

  print(source?: RiverNode, ...end: RiverNode[]) {
    new GraphPrinter(this.graph, source, ...end).print();
  }

  writeToFile() {
    fs.writeFileSync(
      path.join(
        os.homedir(),
        "Downloads",
        `graph-${Math.random().toFixed(3)}.json`
      ),
      JSON.stringify(json.write(this.graph.graph)),
      {
        flag: "w",
      }
    );
  }

  writeGraphVizToFile(title?: string) {
    fs.writeFileSync(
      path.join(
        os.homedir(),
        "Downloads",
        `viz-${title}-${Math.random().toFixed(3)}.html`
      ),
      html(JSON.stringify(json.write(this.graph.graph))),
      {
        flag: "w",
      }
    );
  }
}
