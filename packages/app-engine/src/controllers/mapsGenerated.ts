import { Request } from "express";
import { MemoryStore } from "../services";
import { ISseResponse } from "@toverux/expresse";

export const getUpdates = (store: MemoryStore) => (
  req: Request,
  res: ISseResponse
) => {
  const onMapGenerated = (count: number) => {
    res.sse.event("count", { count });
  };
  store.globalHitsEmitter.addListener("/api/map", onMapGenerated);
  req.on("close", () => {
    store.globalHitsEmitter.off("/api/map", onMapGenerated);
  });
};
