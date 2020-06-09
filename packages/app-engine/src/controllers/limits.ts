import { Request, Response } from "express";
import { MemoryStore } from "../services";
import { limits } from "../constants";

export const getGlobal = (store: MemoryStore) => (
  req: Request,
  res: Response
) => {
  res.send({
    limit: limits.maxGlobal,
    remaining: store.getGlobalRemaining(req.params.route),
  });
};

export const getIp = (store: MemoryStore) => (req: Request, res: Response) => {
  res.send({
    remaining:
      store.getIPRemaining(req.ip, req.params.route) ?? limits.maxPerIP,
    limit: limits.maxPerIP,
  });
};
