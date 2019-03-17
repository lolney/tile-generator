import http from "http";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import bodyParser from "body-parser";
import path from "path";

import config from "./config.json";

let app = express();
app.server = http.createServer(app);

// logger
app.use(morgan("dev"));

// static server
app.use(express.static(path.join(__dirname, "../../public")));

app.get("/", function(req, res) {
  res.sendFile(path.join(__dirname, "../../public", "index.html"));
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

app.server.listen(process.env.PORT || config.port, () => {
  console.log(`Started on port ${app.server.address().port}`);
});

export default app;
