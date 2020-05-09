import { SerializableError } from "types/maps";

export class StartGenerationError extends Error implements SerializableError {
  code = 0 as 0;
}

export class QuadrantsTooSmallError extends Error {}
