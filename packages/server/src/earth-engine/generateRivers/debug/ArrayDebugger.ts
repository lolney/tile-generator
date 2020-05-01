import { TilesArray } from "@tile-generator/common";
import { printSquare } from "./printSquare";

export default class ArrayDebugger {
  array: TilesArray<boolean>;

  constructor(array: TilesArray<boolean>) {
    this.array = array;
  }

  print(msg?: string) {
    printSquare(this.array, (row, col) =>
      this.array.get(row, col) ? "+" : "o"
    );
  }
}
