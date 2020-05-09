import { errorCodes } from "@tile-generator/common";
import Errors from "../map/Errors";

export interface CivMapWriter {
  write: () => Promise<[Buffer, Errors]>;
}

export interface SerializableError extends Error {
  code: keyof typeof errorCodes;
}
