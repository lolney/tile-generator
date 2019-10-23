import mapToNodes from "../mapToNodes";
import { RiversArray } from "../RiversArray";

describe("mapToNodes", () => {
  it("returns the expected number of nodes", () => {
    const array: RiversArray<boolean> = RiversArray.from2D([
      [true, true],
      [false, false]
    ]);
    const graph = mapToNodes(array);

    expect(graph.nodes()).toHaveLength(10);
  });
});
