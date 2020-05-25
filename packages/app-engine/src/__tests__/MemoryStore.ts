import { DateTime, Settings } from "luxon";
import { isEqual } from "lodash";
import { MemoryStore } from "../MemoryStore";

jest.useFakeTimers();

describe("MemoryStore", () => {
  const options = {
    maxPerIP: 1,
    maxGlobal: 2,
  };

  it("should reset after the set interval expires", () => {
    const store = new MemoryStore(options);
    expect(store.hits["key"]).toEqual(0);

    store.incr("key", "/");
    expect(store.hits["key=/"]).toEqual(1);

    jest.runOnlyPendingTimers();
    expect(store.hits["key=/"]).toEqual(0);
    store.incr("key", "/");

    jest.runOnlyPendingTimers();
    expect(store.hits["key=/"]).toEqual(0);
  });

  it("should indicate global and local limits properly", () => {
    const store = new MemoryStore(options);

    expect(store.exceededIPLimit("a", "/")).toBe(false);
    expect(store.exceededGlobalLimit("/")).toBe(false);
    store.incr("a", "/");

    expect(store.exceededIPLimit("a", "/")).toBe(true);
    expect(store.exceededIPLimit("b", "/")).toBe(false);

    store.incr("b", "/");
    expect(store.exceededIPLimit("a", "/")).toBe(true);
    expect(store.exceededIPLimit("b", "/")).toBe(true);
    expect(store.globalHits["/"]).toEqual(options.maxGlobal);
    expect(store.exceededGlobalLimit("/")).toBe(true);
  });

  it("should emit an event for the given route", async () => {
    const store = new MemoryStore(options);

    const foo = new Promise((resolve) =>
      store.globalHitsEmitter.addListener("/foo", (event) => {
        resolve(event);
      })
    );
    const bar = new Promise((resolve) =>
      store.globalHitsEmitter.addListener("/bar", (event) => {
        resolve(event);
      })
    );

    store.incr("a", "/bar");
    expect(await bar).toEqual(1);
    store.incr("a", "/foo");
    expect(await foo).toEqual(1);
  });

  it("nextReset should return the time to the beginning of the next (UTC) day", () => {
    Settings.now = () => Date.UTC(2020, 1, 1, 23, 0, 0, 0);
    const next = MemoryStore.nextReset();
    expect(next).toBe(60 * 60 * 1000 - 1);
  });
});

describe("matchRoute", () => {
  const equivalenceClasses = [
    ["/asdf/sdfsdf?adfsd", "/asdf/sdfsdf?adfsd", "/asdf/sdfsdf/12323"],
    ["/", "/"],
    ["//", "//", "///", "///aaaa"],
    ["/sdf/#sdf", "/sdf/", "/sdf", "/sdf/#sdf"],
    ["/mm/sdfsdf-sad-fs--------#sdf", "/mm/sdfsdf-sad-fs--------"],
    ["/abc/123?q=%2F%2F%2F%2F%26%26", "/abc/123"],
    ["/%2F%2F%2F%2F%26%26/1", "/%2F%2F%2F%2F%26%26/1"],
    [undefined, undefined],
  ];

  it.each(equivalenceClasses)(
    "everything within an equivalence class %j is equal",
    (...klass) => {
      for (const elem of klass) {
        const result = MemoryStore.matchRoute(elem);
        for (const otherElem of klass) {
          expect(result).toEqual(MemoryStore.matchRoute(otherElem));
        }
      }
    }
  );

  it.each(
    equivalenceClasses.filter((klass) =>
      klass.every((elem) => typeof elem === "string")
    )
  )("everything within an equivalence class %j is a string", (...klass) => {
    for (const elem of klass) {
      const result = MemoryStore.matchRoute(elem);
      expect(typeof result).toEqual("string");
    }
  });

  it.each(equivalenceClasses)(
    "nothing in %j is equal to a member of any other equivalence class",
    (...klass) => {
      for (const elem of klass) {
        const result = MemoryStore.matchRoute(elem);

        for (const otherClass of equivalenceClasses) {
          if (isEqual(otherClass, klass)) continue;
          for (const otherElem of otherClass) {
            expect(result).not.toEqual(MemoryStore.matchRoute(otherElem));
          }
        }
      }
    }
  );
});
