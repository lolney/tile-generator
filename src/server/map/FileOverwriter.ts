import path from "path";
import fs from "fs";

const SAVE_DIRECTORY = path.join(__dirname, "../../../maps");

export default class FileOverwriter {
  dst: string;
  buffer: Buffer;

  constructor(template: string, newFilename: string) {
    this.dst = path.join(SAVE_DIRECTORY, newFilename);
    this.buffer = fs.readFileSync(template);
  }

  async insert(index: number, buffer: Buffer) {
    this.buffer = Buffer.concat([
      this.buffer.slice(0, index),
      buffer,
      this.buffer.slice(index)
    ]);
  }

  async overwrite(index: number, buffer: Buffer) {
    buffer.copy(this.buffer, index);
  }

  async writeToFIle() {
    return fs.writeFileSync(this.dst, this.buffer);
  }
}
