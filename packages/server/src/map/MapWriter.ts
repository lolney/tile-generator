import { Tile } from "@tile-generator/common";
const fs = require("fs").promises;

export type MapDataType =
  | "byte"
  | "int"
  | "int0"
  | "string"
  | "stringList"
  | "length(int)"
  | "tile";

type MapDataTypeType = number | string | Array<string> | Tile;

export const TILE_SIZE = 8;

export default class MapWriter {
  private index: number;
  buffer: Buffer;

  constructor(n: number) {
    this.buffer = Buffer.alloc(n);
    this.index = 0;
  }

  async writeToFile(filename: string | Buffer) {
    return fs.writeFile(filename, this.buffer);
  }

  static dataLength(type: MapDataType, val: MapDataTypeType): number {
    switch (type) {
      case "byte":
        return 1;
      case "length(int)":
      case "int":
      case "int0":
        return 4;
      case "stringList":
        let total = 0;
        for (const elem of <string[]>val) {
          total += elem.length + 1;
        }
        return total;
      case "string":
        return (<string>val).length + 1;
      case "tile":
        return TILE_SIZE;
    }
  }

  writeVal(type: MapDataType, val: MapDataTypeType) {
    switch (type) {
      case "byte":
        this.writeByte(<number>val);
        break;
      case "length(int)":
      case "int":
      case "int0":
        this.writeInt(<number>val);
        break;
      case "stringList":
        this.writeStringList(<Array<string>>val);
        break;
      case "string":
        this.writeString(<string>val);
        break;
      case "tile":
        this.writeTile(<Tile>val);
    }
  }

  writeByte(value: number) {
    this.buffer.writeUInt8(value, this.index);
    this.index++;
  }

  protected writeInt(value: number) {
    this.buffer.writeInt32LE(value, this.index);
    this.index += 4;
  }

  protected writeStringList(arr: Array<string>) {
    for (const elem of arr) {
      this.writeString(elem);
    }
  }

  private writeString(elem: string) {
    const str = elem + "\0";
    this.buffer.write(str, this.index);
    this.index += str.length;
  }

  protected writeTile(tile: Tile) {}

  protected writeBytes(buf: Buffer) {
    buf.copy(this.buffer, this.index);
    this.index += buf.length;
  }
}
