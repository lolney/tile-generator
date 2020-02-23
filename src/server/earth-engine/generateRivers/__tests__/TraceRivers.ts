import mapToNodes from "../mapToNodes";
import { RiversArray } from "../RiversArray";
import TraceRivers from "../TraceRivers";
import { RiverIndex } from "../types";

const endpoints: RiverIndex[] = [
  [2, 2],
  [4, 2]
];

const source: RiverIndex = [0, 0];

const river = [
  [true, true, true],
  [true, false, false],
  [true, true, true],
  [true, false, false],
  [true, false, false]
];

const graph = mapToNodes(RiversArray.from2D(river));

describe("TraceRivers", () => {
  it("should output a graph", () => {
    const result = TraceRivers.perform(graph, source, endpoints);
    expect(result).toBeDefined();
  });
});
