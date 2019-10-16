import { Graph } from "graphlib";
import zip from "lodash/zip";

export class RiversArray<T> {
  fields: T[];
  width: number;

  constructor(inputArray: T[], width: number) {
    this.fields = inputArray;
    this.width = width;
  }

  static from2D = <T>(inputArray: T[][]) =>
    new RiversArray(
      inputArray.reduce((value, accum) => [...accum, ...value], []),
      inputArray.length > 0 ? inputArray[0].length : 0
    );

  clone = () => new RiversArray(this.fields, this.width);

  cloneWith = (value: T) =>
    new RiversArray(new Array(this.fields.length).fill(value), this.width);

  get(row: number, col: number) {
    return this.fields[row * this.width + col];
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

  *neighbors(row: number, col: number): IterableIterator<[number, number]> {
    const djs = [-1, 1, 1, -1];
    const dis = [0, -1, 1, 1];

    let i = row;
    let j = col;

    for (const [di, dj] of zip(dis, djs)) {
      const pair: [number, number] = [(i += di), (j += dj)];
      if (this.inBounds(...pair)) yield pair;
    }
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

export type NodeId = string;

export type RawRivers = RiversArray<boolean>;
export type RawRiverSystem = RiversArray<boolean>;
export type RiverEndpoints = RiversArray<boolean>;
export type RiverNodes = Graph;
export type RiverNodesWithSource = {
  graph: Graph;
  source: NodeId;
};
