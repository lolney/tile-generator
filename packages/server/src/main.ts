import http from "http";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import bodyParser from "body-parser";
import path from "path";
import { sse } from "@toverux/expresse";

import {
  constants,
  controllers,
  services,
  middleware,
} from "@tile-generator/app-engine";

import "./config/polyfills";
import config from "./config.json";
import { AddressInfo } from "net";
import MapController from "./controllers/MapController.js";
import UpdateController from "./controllers/UpdateController.js";

let app = express();

// logger
app.use(morgan("dev"));

app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "../../dist", "index.html"));
});

// 3rd party middleware
app.use(
  cors({
    exposedHeaders: config.corsHeaders,
  })
);

app.use(
  bodyParser.json({
    limit: config.bodyLimit,
  })
);

// Rate limiting
const store = new services.MemoryStore(constants.limits);
const printReset = () => {
  console.log("last reset", store.lastReset);
  console.log(
    `next reset in ${Math.ceil(
      services.MemoryStore.nextReset() / (1000 * 60)
    )} minutes`
  );
};
printReset();
setInterval(printReset, 60 * 1000);

app.get("/limits/global/:route", controllers.limitsController.getGlobal(store));

app.get("/limits/ip/:route", controllers.limitsController.getIp(store));

app.get("/maps-generated", sse(), controllers.mapsGenerated.getUpdates(store));

app.use("/", middleware.rateLimitMiddleware(store));

// API
app.post("/api/map", UpdateController);
if (process.env.NODE_ENV !== "production")
  app.get("/api/maps/:id", MapController);

const server = http.createServer(app);
server.listen(process.env.PORT || config.port, () => {
  const address = server.address();
  console.log(
    `Started on port ${address ? (address as AddressInfo).port : "null"}`
  );
});
