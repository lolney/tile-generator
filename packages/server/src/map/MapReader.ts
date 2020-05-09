import path from "path";
import fs from "fs";
import { SAVE_DIRECTORY } from "../constants";

export default class MapReader {
  static readFile(filename: string) {
    try {
      return fs.readFileSync(path.join(SAVE_DIRECTORY, filename));
    } catch (error) {
      console.warn(error);
      return null;
    }
  }
}
