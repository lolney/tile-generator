import { TilesArray } from "../../../../common/TilesArray";

export function printSquare<T>(
  array: TilesArray<T>,
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

  if (msg) console.debug(msg);
  console.debug(output);
}
