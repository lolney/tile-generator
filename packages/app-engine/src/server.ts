import express from "express";
import proxy from "express-http-proxy";
import morgan from "morgan";
import cors from "cors";
import sse from "@toverux/expresse";

import { AddressInfo } from "net";
import { limits } from "./constants";
import { MemoryStore, TokenService } from "./services";
import { rateLimitMiddleware } from "./middleware/rateLimitMiddleware";
import { gcpTokenMiddleware } from "./middleware/gcpTokenMiddleware";

import * as limitsController from "./controllers/limits";
import * as mapsGenerated from "./controllers/mapsGenerated";

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

  app.get("/limits/global/:route", limitsController.getGlobal(store));

  app.get("/limits/ip/:route", limitsController.getIp(store));

  app.get("/maps-generated", sse(), mapsGenerated.getUpdates(store));

  app.use("/", rateLimitMiddleware(store));
  if (process.env.NODE_ENV === "production")
    app.use("/", gcpTokenMiddleware(tokenService));
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
