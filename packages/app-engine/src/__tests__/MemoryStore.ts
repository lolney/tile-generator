import { DateTime, Settings } from "luxon";
import { MemoryStore } from "../MemoryStore";

jest.useFakeTimers();

describe("MemoryStore", () => {
  const options = {
    maxPerIP: 1,
    maxGlobal: 2,
  };

  it("should reset after the set interval expires", () => {
    const store = new MemoryStore(options);
    expect(store.hits["key"]).toBeUndefined();

    store.incr("key");
    expect(store.hits["key"]).toEqual(1);

    jest.runOnlyPendingTimers();
    expect(store.hits["key"]).toBeUndefined();
    store.incr("key");

    jest.runOnlyPendingTimers();
    expect(store.hits["key"]).toBeUndefined();
  });

  it("should indicate global and local limits properly", () => {
    const store = new MemoryStore(options);

    expect(store.exceededIPLimit("a")).toBe(false);
    expect(store.exceededGlobalLimit()).toBe(false);
    store.incr("a");

    expect(store.exceededIPLimit("a")).toBe(true);
    expect(store.exceededIPLimit("b")).toBe(false);

    store.incr("b");
    expect(store.exceededIPLimit("a")).toBe(true);
    expect(store.exceededIPLimit("b")).toBe(true);
    expect(store.exceededGlobalLimit()).toBe(true);
  });

  it("nextReset should return the time to the beginning of the next (UTC) day", () => {
    Settings.now = () => Date.UTC(2020, 1, 1, 23, 0, 0, 0);
    const next = MemoryStore.nextReset();
    expect(next).toBe(60 * 60 * 1000 - 1);
  });
});
