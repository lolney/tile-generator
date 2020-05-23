import { DateTime } from "luxon";

interface StoreOptions {
  maxPerIP: number;
  maxGlobal: number;
}

export class MemoryStore {
  hits: { [K: string]: number };
  globalHits: { [K: string]: number };
  lastReset: Date;
  interval: NodeJS.Timeout;
  options: StoreOptions;

  constructor(options: StoreOptions) {
    this.options = options;

    const reset = () => {
      // prettier-ignore
      this.hits = new Proxy({}, {
          get: (target: { [K: string]: number }, name: string) =>
            name in target ? target[name] : 0,
        }
      );
      // prettier-ignore
      this.globalHits = new Proxy({}, {
        get: (target: { [K: string]: number }, name: string) =>
          name in target ? target[name] : 0,
      }
    );
      this.lastReset = new Date();
    };

    const timeout = () => {
      reset();
      this.interval = setTimeout(timeout, MemoryStore.nextReset());
    };

    timeout();
  }

  incr(ip: string, route: string) {
    const key = MemoryStore.createKey(ip, route);

    this.globalHits[route]++;
    this.hits[key]++;
  }

  getGlobalRemaining(route: string) {
    return this.options.maxGlobal - this.globalHits[route];
  }

  getIPRemaining(ip: string, route: string) {
    const key = MemoryStore.createKey(ip, route);
    return this.options.maxPerIP - this.hits[key];
  }

  exceededGlobalLimit(route: string) {
    return this.getGlobalRemaining(route) <= 0;
  }

  exceededIPLimit(ip: string, route: string) {
    return this.getIPRemaining(ip, route) <= 0;
  }

  static nextReset = () =>
    DateTime.utc().endOf("day").diff(DateTime.utc()).milliseconds;

  // prettier-ignore
  static matchRoute = (path: string) =>
    /(^\/+$)|((\/[-a-zA-Z0-9@:%._\+~]*)+((\/(?![#?])(?!$))|[-a-zA-Z0-9@:%._\+~]))/g.exec(path)?.[0];

  static createKey = (ip: string, path: string) => {
    const route = MemoryStore.matchRoute(path);
    return `${ip}=${route}`;
  };
}
