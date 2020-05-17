import express from "express";
import { MemoryStore } from "./MemoryStore";
import { rateLimitMiddleware } from "./rateLimitMiddleware";

const PORT = Number(process.env.PORT) || 8888;

export const limits = {
  maxGlobal: 1000,
  maxPerIP: 20,
};

export const server = (settings?: string[]) => {
  const app = express();
  const store = new MemoryStore(limits);

  for (const setting of settings || []) {
    app.enable(setting);
  }

  app.get("/", rateLimitMiddleware(store), (req, res) => {
    res.send("🎉 Hello TypeScript! 🎉");
  });

  return app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
  });
};

export default server;
