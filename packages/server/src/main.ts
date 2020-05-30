import http from "http";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import bodyParser from "body-parser";
import path from "path";
import sse from "@toverux/expresse";

import "./config/polyfills";
import config from "./config.json";
import { AddressInfo } from "net";
import MapController from "./controllers/MapController.js";
import UpdateController, {
  UpdateExistsMiddleware,
} from "./controllers/UpdateController.js";
import TilesController from "./controllers/TilesController.js";

let app = express();

const server = http.createServer(app);

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

// API
app.post("/api/map", TilesController);
app.get("/updates/:id", UpdateExistsMiddleware, sse(), UpdateController);
if (!process.env.GOOGLE_APPLICATION_CREDENTIALS)
  app.get("/api/map/:id", MapController);

server.listen(process.env.PORT || config.port, () => {
  const address = server.address();
  console.log(
    `Started on port ${address ? (address as AddressInfo).port : "null"}`
  );
});
