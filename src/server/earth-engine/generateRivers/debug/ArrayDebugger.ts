import { RiversArray } from "../RiversArray";
import { printSquare } from "./printSquare";

export default class ArrayDebugger {
  array: RiversArray<boolean>;

  constructor(array: RiversArray<boolean>) {
    this.array = array;
  }

  print(msg?: string) {
    printSquare(this.array, (row, col) =>
      this.array.get(row, col) ? "+" : "o"
    );
  }
}
