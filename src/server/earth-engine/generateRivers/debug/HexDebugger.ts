import { chain } from "lodash";
import RiverNodes from "../RiverNodes";
import { TilesArray } from "../../../../common/TilesArray";
import { printSquare } from "./printSquare";

const hex = (row: number, col: number) => (
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
 |    ${row},${col}     |
 |              |
 |              ${c}
${e}\\-          -/
    \\-      -/   
      \\-  -/     
       ${d}      
`;

export default class HexDebugger {
  graph: RiverNodes;
  array: TilesArray<number[]>;

  constructor(graph: RiverNodes) {
    this.graph = graph;
    const coords = this.graph.nodes().map((node) => node.toCoords());
    const groups = chain(coords)
      .groupBy((coords: number[]) => `${coords[0]},${coords[1]}`)
      .mapValues((coords: number[][]) => coords.map((c) => c[2]))
      .entries()
      .sortBy([([key]) => key])
      .value();

    this.array = TilesArray.fromDimensions(
      this.graph.width,
      this.graph.height,
      []
    );
    groups.forEach(([key, vertices]) => {
      if (vertices.length && typeof vertices[0] !== "number")
        throw new Error(
          `graph conversation failed for vertices: ${vertices} :: ${typeof vertices[0]}`
        );

      const [row, col] = key.split(",").map((n) => parseInt(n));
      if (row == null || col == null) throw new Error("invalid groups");
      this.array.set(row, col, vertices);
    });
  }

  print = (msg?: string) =>
    printSquare(
      this.array,
      (row, col) => {
        const coords = this.hexFromCoords(row, col);
        return coords.every((num) => num === ".")
          ? ""
          : hex(row, col)(...this.hexFromCoords(row, col));
      },
      msg
    );

  printIndividuals() {
    for (const [row, col] of this.array.pairs()) {
      const val = this.array.get(row, col);
      if (val.length > 0) {
        console.debug(`Hex at: ${row}, ${col}`);
        console.debug(hex(row, col)(...this.hexFromCoords(row, col)));
      }
    }
  }

  private hexFromCoords = (
    row: number,
    col: number
  ): [string, string, string, string, string, string] => {
    return ([0, 1, 2, 3, 4, 5].map((i) => {
      const neighbors = this.graph.graph.neighbors(`${row},${col},${i}`);
      if (!neighbors) return ".";
      return `${
        neighbors.filter((bor) => !bor.startsWith(`${row},${col}`)).length
      }`;
    }) as unknown) as [string, string, string, string, string, string];
  };
}
