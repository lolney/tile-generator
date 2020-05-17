import { DateTime } from "luxon";

interface StoreOptions {
  maxPerIP: number;
  maxGlobal: number;
}

export class MemoryStore {
  hits: { [K: string]: number };
  globalHits: number;
  lastReset: Date;
  interval: NodeJS.Timeout;
  options: StoreOptions;

  constructor(options: StoreOptions) {
    this.options = options;

    const reset = () => {
      this.hits = {};
      this.globalHits = 0;
      this.lastReset = new Date();
    };

    const timeout = () => {
      reset();
      this.interval = setTimeout(timeout, MemoryStore.nextReset());
    };

    timeout();
  }

  incr(key: string) {
    this.globalHits++;
    if (this.hits[key]) {
      this.hits[key]++;
    } else {
      this.hits[key] = 1;
    }

    return {
      global: this.globalHits,
      ip: this.hits[key],
    };
  }

  getGlobalRemaining() {
    return this.options.maxGlobal - this.globalHits;
  }

  getIPRemaining(key: string) {
    return this.options.maxPerIP - this.hits[key];
  }

  exceededGlobalLimit() {
    return this.getGlobalRemaining() <= 0;
  }

  exceededIPLimit(key: string) {
    return this.getIPRemaining(key) <= 0;
  }

  static nextReset = () =>
    DateTime.utc().endOf("day").diff(DateTime.utc()).milliseconds;
}
