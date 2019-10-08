import { Graph } from "graphlib";

export class RiversArray<T> {
  fields: T[];
  width: number;

  constructor(inputArray: T[], width: number) {
    this.fields = inputArray;
    this.width = width;
  }

  clone = () => new RiversArray(this.fields, this.width);

  get(row: number, col: number) {
    return this.fields[row * this.width + col];
  }

  set(row: number, col: number, value: T) {
    this.fields[row * this.width + col] = value;
  }

  get height() {
    return this.fields.length / this.width;
  }

  *pairs(): IterableIterator<[number, number]> {
    for (let i = 0; i < this.height; i++) {
      for (let j = 0; j < this.width; j++) {
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

export type RawRivers = RiversArray<boolean>;
export type RawRiverSystem = RiversArray<boolean>;
export type RiverEndpoints = RiversArray<boolean>;
export type RiverNodes = Graph;
