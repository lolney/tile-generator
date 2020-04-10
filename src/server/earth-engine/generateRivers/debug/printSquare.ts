import { RiversArray } from "../RiversArray";

export function printSquare<T>(
  array: RiversArray<T>,
  formatter: (row: number, col: number) => string,
  msg?: string
) {
  let output = "";
  let lastRow = 0;
  for (const [row, col] of array.pairs()) {
    if (lastRow !== row) output += "\n";
    output += formatter(row, col);
    lastRow = row;
  }

  if (msg) console.log(msg);
  console.log(output);
}
