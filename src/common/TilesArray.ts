import { range, zip } from "lodash";

export class TilesArray<T> {
  fields: T[];
  width: number;

  constructor(inputArray: T[], width: number) {
    this.fields = inputArray;
    this.width = width;
  }

  static fromDimensions = <T>(width: number, height: number, defaultValue: T) =>
    new TilesArray(Array(width * height).fill(defaultValue), width);

  static from2D = <T>(inputArray: T[][]) =>
    new TilesArray(
      inputArray.reduce((value, accum) => [...accum, ...value], []),
      inputArray.length > 0 ? inputArray[0].length : 0
    );

  to2D = () => {
    const output = [];
    for (const row of range(0, this.height))
      output.push(this.fields.slice(row * this.width, (row + 1) * this.width));
    return output;
  };

  clone = () => new TilesArray(this.fields, this.width);

  cloneWith = (value: T) =>
    new TilesArray<T>(new Array(this.fields.length).fill(value), this.width);

  getIndex(row: number, col: number) {
    return row * this.width + col;
  }

  get(row: number, col: number) {
    return this.fields[this.getIndex(row, col)];
  }

  getWithBoundsCheck(row: number, col: number) {
    if (this.inBounds(row, col)) return this.get(row, col);
  }

  set(row: number, col: number, value: T) {
    this.fields[row * this.width + col] = value;
  }

  get height() {
    return this.fields.length / this.width;
  }

  inBounds(row: number, col: number) {
    return row >= 0 && col >= 0 && col < this.width && row < this.height;
  }

  *neighborsSquare(
    row: number,
    col: number
  ): IterableIterator<[number, number]> {
    const djs = [-1, 1, 1, -1];
    const dis = [0, -1, 1, 1];

    let i = row;
    let j = col;

    for (const [di, dj] of zip(dis, djs)) {
      const pair: [number, number] = [(i += <number>di), (j += <number>dj)];
      if (this.inBounds(...pair)) yield pair;
    }
  }

  left = (row: number, col: number): [number, number] => {
    const nextRow = row;
    const nextCol = col - 1;
    return [nextRow, nextCol];
  };

  right = (row: number, col: number): [number, number] => {
    const nextRow = row;
    const nextCol = col + 1;
    return [nextRow, nextCol];
  };

  topLeft = (row: number, col: number): [number, number] => {
    const nextRow = row - 1;
    const nextCol = row % 2 === 0 ? col : col - 1;
    return [nextRow, nextCol];
  };

  topRight = (row: number, col: number): [number, number] => {
    const nextRow = row - 1;
    const nextCol = row % 2 === 0 ? col + 1 : col;
    return [nextRow, nextCol];
  };

  bottomLeft = (row: number, col: number): [number, number] => {
    const nextRow = row + 1;
    const nextCol = row % 2 === 0 ? col : col - 1;
    return [nextRow, nextCol];
  };

  bottomRight = (row: number, col: number): [number, number] => {
    const nextRow = row + 1;
    const nextCol = row % 2 === 0 ? col + 1 : col;
    return [nextRow, nextCol];
  };

  leftValue = (row: number, col: number): T | undefined =>
    this.getWithBoundsCheck(...this.left(row, col));

  rightValue = (row: number, col: number): T | undefined =>
    this.getWithBoundsCheck(...this.right(row, col));

  topLeftValue = (row: number, col: number): T | undefined =>
    this.getWithBoundsCheck(...this.topLeft(row, col));

  topRightValue = (row: number, col: number): T | undefined =>
    this.getWithBoundsCheck(...this.topRight(row, col));

  bottomLeftValue = (row: number, col: number): T | undefined =>
    this.getWithBoundsCheck(...this.bottomLeft(row, col));

  bottomRightValue = (row: number, col: number): T | undefined =>
    this.getWithBoundsCheck(...this.bottomRight(row, col));

  *neighbors(row: number, col: number): IterableIterator<[number, number]> {
    const pairs = [
      this.left(row, col),
      this.topLeft(row, col),
      this.topRight(row, col),
      this.right(row, col),
      this.bottomRight(row, col),
      this.bottomLeft(row, col),
    ];

    for (const pair of pairs) {
      if (this.inBounds(...pair)) yield pair;
    }
  }

  *pairs(
    start = [0, 0],
    end = [this.height, this.width]
  ): IterableIterator<[number, number]> {
    start = start.map((val) => Math.max(0, val));
    end = end.map((val) => Math.min(val));
    for (let i = start[0]; i < end[0]; i++) {
      for (let j = start[1]; j < end[1]; j++) {
        yield [i, j];
      }
    }
  }

  *row(row: number): IterableIterator<T> {
    for (let j = 0; j < this.width; j++) {
      yield this.get(row, j);
    }
  }

  *rows(): IterableIterator<IterableIterator<T>> {
    for (let i = 0; i < this.height; i++) {
      yield this.row(i);
    }
  }
}
