import { Request, Response, NextFunction } from "express";
import { MemoryStore } from "./MemoryStore";

const whitelistedMethods = ["Options"];

export const rateLimitMiddleware = (store: MemoryStore) => (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { ip, path } = req;

  if (whitelistedMethods.includes(req.method)) return next();

  const resetTime = Math.ceil(MemoryStore.nextReset() / 1000);
  const ipRemaining = store.getIPRemaining(ip, path);
  const globalRemaining = store.getGlobalRemaining(path);

  if ((globalRemaining < 1 || ipRemaining < 1) && !res.headersSent) {
    if (!res.headersSent) {
      res.setHeader("Retry-After", resetTime);
    }
    const message = globalRemaining < 1 ? { errors: [11] } : { errors: [10] };
    return res.status(429).send(message);
  }

  store.incr(ip, path);

  if (!res.headersSent) {
    res.setHeader("X-RateLimit-Limit", store.options.maxPerIP);
    res.setHeader("X-RateLimit-Remaining", store.getIPRemaining(ip, path));
    res.setHeader("Date", new Date().toUTCString());
    res.setHeader("X-RateLimit-Reset", resetTime);
  }

  next();
};
