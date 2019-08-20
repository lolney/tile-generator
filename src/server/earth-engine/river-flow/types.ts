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
}

export type RawRivers = RiversArray<boolean>;
export type RawRiverSystem = RiversArray<boolean>;
export type RiverEndpoints = RiversArray<boolean>;
