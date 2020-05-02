const { PerformanceObserver, performance } = require("perf_hooks");

const obs = new PerformanceObserver((items: any) => {
  console.log(items.getEntries()[0].duration);
  performance.clearMarks();
});
obs.observe({ entryTypes: ["measure"] });

export function logperformance<T extends Array<any>, U>(f: (...args: T) => U) {
  return async function (...args: T) {
    performance.mark("A");

    const result = await f(...args);

    performance.mark("B");
    performance.measure("A to B", "A", "B");

    performance.clearMarks();

    return result;
  };
}
