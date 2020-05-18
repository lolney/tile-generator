import express from "express";
import proxy from "express-http-proxy";
import morgan from "morgan";
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
