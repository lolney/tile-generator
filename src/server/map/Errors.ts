import { StartGenerationError } from "./Civ6StartPositions/errors";

export default class Errors {
  nonFatalErrors: Error[];

  constructor() {
    this.nonFatalErrors = [];
  }

  static isNonFatalError = (error: Error) => {
    if (error instanceof StartGenerationError) return true;
    return false;
  };

  async collect<T>(func: () => T, defaultValue: T): Promise<T> {
    try {
      return await func();
    } catch (e) {
      if (Errors.isNonFatalError(e)) {
        this.nonFatalErrors.push(e);
        return defaultValue;
      }
      throw e;
    }
  }
}
