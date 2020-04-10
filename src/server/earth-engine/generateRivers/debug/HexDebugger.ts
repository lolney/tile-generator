import { chain } from "lodash";
import RiverNodes from "../RiverNodes";
import { RiversArray } from "../RiversArray";
import { printSquare } from "./printSquare";

const hex = (
  a: string,
  b: string,
  c: string,
  d: string,
  e: string,
  f: string
): string =>
  `
        ${a}\\    
      /-  -\\     
    /-      -\\   
  /-          -\\ 
 ${f}              ${b}
 |              |
 |              |
 |              |
 |              |
 |              ${c}
${e}\\-          -/
    \\-      -/   
      \\-  -/     
       ${d}      
`;

export default class GraphPrinter {
  graph: RiverNodes;
  array: RiversArray<number[]>;

  constructor(graph: RiverNodes) {
    this.graph = graph;
    const coords = this.graph.nodes().map(node => node.toCoords());
    const groups = chain(coords)
      .groupBy((coords: number[]) => `${coords[0]},${coords[1]}`)
      .mapValues((coords: number[][]) => coords.map(c => c[2]))
      .entries()
      .sortBy([([key]) => key])
      .value();

    this.array = RiversArray.fromDimensions(
      this.graph.width,
      this.graph.height,
      []
    );
    groups.forEach(([key, vertices]) => {
      if (vertices.length && typeof vertices[0] !== "number")
        throw new Error(
          `graph conversation failed for vertices: ${vertices} :: ${typeof vertices[0]}`
        );

      const [row, col] = key.split(",").map(n => parseInt(n));
      if (row == null || col == null) throw new Error("invalid groups");
      this.array.set(row, col, vertices);
    });
  }

  print = (msg?: string) =>
    printSquare(
      this.array,
      (row, col) => hex(...this.hexFromCoords(row, col)),
      msg
    );

  printIndividuals() {
    for (const [row, col] of this.array.pairs()) {
      const val = this.array.get(row, col);
      if (val.length > 0) {
        console.log(`Hex at: ${row}, ${col}`);
        console.log(hex(...this.hexFromCoords(row, col)));
      }
    }
  }

  private hexFromCoords = (
    row: number,
    col: number
  ): [string, string, string, string, string, string] => {
    return ([0, 1, 2, 3, 4, 5].map(i => {
      const neighbors = this.graph.graph.neighbors(`${row},${col},${i}`);
      return `${neighbors ? neighbors.length : 0}`;
    }) as unknown) as [string, string, string, string, string, string];
  };
}
