import http from "http";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import bodyParser from "body-parser";
import path from "path";
// @ts-ignore
import sseExpress from "sse-express";

import config from "./config.json";
import EarthEngine from "./earth-engine/EarthEngine";
import { AddressInfo } from "net";
import MapController from "./controllers/MapController.js";
import UpdateController, {
  UpdateExistsMiddleware
} from "./controllers/UpdateController.js";
import TilesController from "./controllers/TilesController.js";

let app = express();

export default EarthEngine.init().then(earthEngine => {
  const server = http.createServer(app);

  // logger
  app.use(morgan("dev"));

  // static server
  app.use(express.static(path.join(__dirname, "../../dist")));

  app.get("/", function(req, res) {
    res.sendFile(path.join(__dirname, "../../dist", "index.html"));
  });

  // 3rd party middleware
  app.use(
    cors({
      exposedHeaders: config.corsHeaders
    })
  );

  app.use(
    bodyParser.json({
      limit: config.bodyLimit
    })
  );

  // API
  app.post("/api/map", TilesController);
  app.get("/updates/:id", UpdateExistsMiddleware, sseExpress, UpdateController);
  app.get("/api/map/:id", MapController);

  server.listen(process.env.PORT || config.port, () => {
    const address = server.address();
    console.log(
      `Started on port ${address ? (<AddressInfo>address).port : "null"}`
    );
  });

  return app;
});
