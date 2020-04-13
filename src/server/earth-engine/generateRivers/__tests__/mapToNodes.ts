import mapToNodes from "../mapToNodes";
import { RiversArray } from "../RiversArray";
import { alg } from "graphlib";

const left = [
  [false, false, false],
  [true, true, false],
  [false, false, false]
];

const upperLeft = [
  [true, false, false],
  [false, true, false],
  [false, false, false]
];

const upperRight = [
  [false, true, false],
  [false, true, false],
  [false, false, false]
];

const right = [
  [false, false, false],
  [false, true, true],
  [false, false, false]
];

const bottomRight = [
  [false, false, false],
  [false, true, false],
  [false, true, false]
];

const bottomLeft = [
  [false, false, false],
  [false, true, false],
  [true, false, false]
];

describe("mapToNodes", () => {
  [left, upperLeft, upperRight, right, bottomRight, bottomLeft].forEach(
    testcase => {
      describe(`with array ${testcase}`, () => {
        const array: RiversArray<boolean> = RiversArray.from2D(testcase);
        const graph = mapToNodes(array);

        it("returns the expected number of nodes", () => {
          expect(graph.graph.nodes()).toHaveLength(12);
        });

        it("is fully connected", () => {
          const genSpanningTree = () => alg.prim(graph.graph, () => 1);
          expect(genSpanningTree).not.toThrow();
        });
      });
    }
  );
});
