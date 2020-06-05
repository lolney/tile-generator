import express from "express";
import proxy from "express-http-proxy";
import morgan from "morgan";
import cors from "cors";
import sse, { ISseResponse } from "@toverux/expresse";

import { AddressInfo } from "net";
import { MemoryStore, TokenService } from "./services";
import { rateLimitMiddleware } from "./middleware/rateLimitMiddleware";

export const limits = {
  maxGlobal: 1000,
  maxPerIP: 20,
};

interface Options {
  settings?: string[];
  proxyHost: string;
  port: string | number;
}

export const createServer = ({ settings, proxyHost, port }: Options) => {
  const app = express();
  const store = new MemoryStore(limits);
  const tokenService = new TokenService(proxyHost);

  app.use(morgan("dev"));

  app.use(cors());

  app.get("/limits/global/:route", (req, res) => {
    res.send({
      limit: limits.maxGlobal,
      remaining: store.getGlobalRemaining(req.params.route),
    });
  });

  app.get("/limits/ip/:route", (req, res) => {
    res.send({
      remaining:
        store.getIPRemaining(req.ip, req.params.route) ?? limits.maxPerIP,
      limit: limits.maxPerIP,
    });
  });

  app.get("/maps-generated", sse(), (req, res: ISseResponse) => {
    const onMapGenerated = (count: number) => {
      res.sse.event("count", { count });
    };
    store.globalHitsEmitter.addListener("/api/map", onMapGenerated);
    req.on("close", () => {
      store.globalHitsEmitter.off("/api/map", onMapGenerated);
    });
  });

  app.use("/", rateLimitMiddleware(store));
  if (process.env.NODE_ENV === "production")
    app.use("/", async (req, res, next) => {
      const token = await tokenService.getToken();
      req.headers.authorization = `Bearer ${token}`;
      next();
    });
  app.use("/", proxy(proxyHost));

  for (const setting of settings || []) {
    app.enable(setting);
  }

  const server = app.listen(port, () => {
    const { port } = server.address() as AddressInfo;
    console.log(`App listening on ${port}`);
  });
  return server;
};

export default createServer;
