import RiverNodes from "../RiverNodes";
import RiverNode from "../RiverNode_";
import { printSquare } from "./printSquare";

export default class GraphPrinter {
  graph: RiverNodes;
  end: number[];
  source: number[];

  constructor(graph: RiverNodes, source?: RiverNode, end?: RiverNode) {
    this.graph = graph;
    this.end = end?.toCoords() ?? [];
    this.source = source?.toCoords() ?? [];
  }

  endChar(row: number, col: number) {
    const [endRow, endCol] = this.end;
    return row === endRow && col === endCol;
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
