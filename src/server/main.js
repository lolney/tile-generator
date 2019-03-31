import http from "http";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import bodyParser from "body-parser";
import path from "path";
import sseExpress from "sse-express";

import config from "./config.json";
import EarthEngine from "./earth-engine/EarthEngine.js";
import OpenRequest, { N_LAYERS } from "./api/OpenRequest.js";

let app = express();
let requestMap = {};

EarthEngine.init().then(earthEngine => {
  app.server = http.createServer(app);

  // logger
  app.use(morgan("dev"));

  // static server
  app.use(express.static(path.join(__dirname, "../../build")));

  app.get("/", function(req, res) {
    res.sendFile(path.join(__dirname, "../../build", "index.html"));
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

  // API starter
  app.post("/api/map", function(req, res) {
    let request;

    try {
      request = OpenRequest.parseRequest(req.body);
    } catch (err) {
      console.log(err);
      res.status(400).send(err.toString());
      return;
    }

    requestMap[request.id] = request;

    res.setHeader("Content-Type", "application/json");
    res.send({
      grid: request.mapBuilder.grid,
      id: request.id,
      nLayers: N_LAYERS
    });
  });

  // sse
  app.get("/updates/:id", sseExpress, async function(req, res) {
    const request = requestMap[req.params.id];

    if (!request) {
      res.send(404);
    } else {
      for await (const layer of request.completeJobs(earthEngine)) {
        res.sse("layer", {
          layer
        });
      }
    }
  });

  app.get("/api/map/:id", async (req, res) => {
    const request = requestMap[req.params.id];

    if (!request || !request.complete) {
      res.send(404);
    } else {
      const buffer = await request.createFile();
      res.setHeader(
        "Content-Disposition",
        `attachment; filename=${request.getFileName()}`
      );
      res.setHeader("Content-Type", "application/octet-stream");

      res.write(buffer, "binary");
      res.end(undefined, "binary");
    }
  });

  app.server.listen(process.env.PORT || config.port, () => {
    console.log(`Started on port ${app.server.address().port}`);
  });
});

export default app;
