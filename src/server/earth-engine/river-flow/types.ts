import { Graph } from "graphlib";

export class RiversArray<T> {
  fields: T[];
  width: number;

  constructor(inputArray: T[], width: number) {
    this.fields = inputArray;
    this.width = width;
  }

  clone = () => new RiversArray(this.fields, this.width);

  get(i: number, j: number) {
    return this.fields[j * this.width + i];
  }

  set(i: number, j: number, value: T) {
    this.fields[j * this.width + i] = value;
  }

  get height() {
    return this.fields.length / this.width;
  }

  *row(row: number): IterableIterator<T> {
    for (let j = 0; j < this.height; j++) {
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
