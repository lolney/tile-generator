const { performance } = require("perf_hooks");

export function logperformance<T extends Array<any>, U>(f: (...args: T) => U) {
  return async function (...args: T) {
    performance.mark("A");

    const result = await f(...args);

    performance.mark("B");
    performance.measure("A to B", "A", "B");
    const measure = performance.getEntriesByName("A to B")[0];
    console.log(`${f.name} took ${measure.duration} milis`);

    performance.clearMarks();
    performance.clearMeasures();

    return result;
  };
}
