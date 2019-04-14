import requests from "../db/openRequest";
import { Request, Response } from "express";
import OpenRequest, { N_LAYERS } from "./OpenRequest";

export default function TilesController(req: Request, res: Response) {
  let request;

  try {
    request = OpenRequest.parseRequest(req.body);
  } catch (err) {
    console.log(err);
    res.status(400).send(err.toString());
    return;
  }

  requests.set(request.id, request);

  res.setHeader("Content-Type", "application/json");
  res.send({
    grid: request.mapBuilder.grid,
    id: request.id,
    nLayers: N_LAYERS
  });
}
