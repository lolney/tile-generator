import express from "express";
import proxy from "express-http-proxy";
import morgan from "morgan";
import cors from "cors";
import { AddressInfo } from "net";
import { MemoryStore } from "./MemoryStore";
import { rateLimitMiddleware } from "./rateLimitMiddleware";

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
        store.getIPRemaining(req.ip, req.params.route) || limits.maxPerIP,
      limit: limits.maxPerIP,
    });
  });

  app.use("/", rateLimitMiddleware(store));
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
