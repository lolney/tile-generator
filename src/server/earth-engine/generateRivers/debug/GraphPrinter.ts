import RiverNodes from "../RiverNodes";
import RiverNode from "../RiverNode_";
import { printSquare } from "./printSquare";
import { RiverNode as RiverNodeType } from "../types";

export default class GraphPrinter {
  graph: RiverNodes;
  ends: Set<RiverNodeType>;
  source: number[];

  constructor(graph: RiverNodes, source?: RiverNode, ...ends: RiverNode[]) {
    this.graph = graph;
    this.ends = new Set(
      ends.map(end =>
        end
          .toCoords()
          .slice(0, 2)
          .join(",")
      )
    );
    this.source = source?.toCoords() ?? [];
  }

  endChar(row: number, col: number) {
    return this.ends.has([row, col].join(","));
  }

  startChar(row: number, col: number) {
    const [startRow, startCol] = this.source;
    return startRow === row && col === startCol;
  }

  getChar(row: number, col: number, isElem: boolean) {
    const isEnd = this.endChar(row, col);
    const isStart = this.startChar(row, col);

    if (isEnd && isStart) return "ø";
    if (isEnd) return "x";
    if (isStart) return "o";
    if (isElem) return "+";
    return "-";
  }

  print() {
    const array = this.graph.toRiversArray();
    printSquare(array, (row, col) =>
      this.getChar(row, col, array.get(row, col))
    );
  }
}
