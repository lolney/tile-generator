import { SerializableError } from "types/maps";

export default class Errors {
  nonFatalErrors: SerializableError[];

  constructor() {
    this.nonFatalErrors = [];
  }

  static isNonFatalError = (error: Error): error is SerializableError => {
    return (error as SerializableError).code != null;
  };

  serialize = () => this.nonFatalErrors.map((elem) => elem.code);

  async collect<T>(func: () => T, defaultValue: T): Promise<T> {
    try {
      return await func();
    } catch (e) {
      if (Errors.isNonFatalError(e)) {
        console.error(`Nonfatal error: ${e}`);
        this.nonFatalErrors.push(e);
        return defaultValue;
      }
      throw e;
    }
  }
}
