const { performance } = require("perf_hooks");

export function logperformance<T extends Array<any>, U>(f: (...args: T) => U) {
  return async function (...args: T) {
    const start = performance.now();

    const result = await f(...args);

    console.log(performance.now() - start);

    return result;
  };
}
