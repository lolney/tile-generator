import path from "path";
import fs from "fs";
import { SAVE_DIRECTORY } from "../constants";
export default class FileOverwriter {
  buffer: Buffer;

  constructor(template: string) {
    this.buffer = fs.readFileSync(template);
  }

  async insert(index: number, buffer: Buffer) {
    this.buffer = Buffer.concat([
      this.buffer.slice(0, index),
      buffer,
      this.buffer.slice(index),
    ]);
  }

  async overwrite(index: number, buffer: Buffer) {
    buffer.copy(this.buffer, index);
  }
}
