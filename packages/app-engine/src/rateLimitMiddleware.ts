import { Request, Response, NextFunction } from "express";
import { MemoryStore } from "./MemoryStore";

export const rateLimitMiddleware = (store: MemoryStore) => (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const key = req.ip;

  store.incr(key);

  const resetTime = Math.ceil(MemoryStore.nextReset() / 1000);
  const ipRemaining = store.getIPRemaining(key);
  const globalRemaining = store.getGlobalRemaining();

  if (!res.headersSent) {
    res.setHeader("X-RateLimit-Limit", store.options.maxPerIP);
    res.setHeader("X-RateLimit-Remaining", store.getIPRemaining(key));
    res.setHeader("Date", new Date().toUTCString());
    res.setHeader("X-RateLimit-Reset", resetTime);
  }

  if ((globalRemaining < 1 || ipRemaining < 1) && !res.headersSent) {
    if (!res.headersSent) {
      res.setHeader("Retry-After", resetTime);
    }
    const message =
      globalRemaining < 1
        ? "Daily global request limit exceeded"
        : "Daily map request limit exceeded";
    return res.status(429).send(message);
  }

  next();
};
