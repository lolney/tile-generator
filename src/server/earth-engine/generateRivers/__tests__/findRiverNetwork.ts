import findRiverNetwork from "../findRiverNetwork";
import { Graph } from "graphlib";

describe("findRiverNetwork", () => {
  const graph = new Graph({ directed: false }).setNodes([
    "a",
    "b",
    "c",
    "d",
    "f"
  ]);

  graph.setEdge("a", "b");
  graph.setEdge("b", "c");
  graph.setEdge("c", "d");
  graph.setEdge("b", "f");

  it("should return a graph consisting without the edges cd, bf", () => {
    const result = findRiverNetwork(graph);
    const edges = result.edges();

    expect(edges).not.toContain({ v: "c", w: "d" });
    expect(edges).not.toContain({ v: "b", w: "f" });
  });
});
