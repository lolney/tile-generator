import requests from "../db/openRequest";
import { Request, Response } from "express";

export default async function UpdateController(req: Request, res: Response) {
  const request = requests.get(req.params.id);

  for await (const layer of request.completeJobs()) {
    console.log("sending layer", layer);
    // @ts-ignore
    res.sse("layer", {
      layer
    });
  }
}

export const UpdateExistsMiddleware = (req: Request, res: Response) => {
  if (!requests.has(req.params.id)) {
    res.sendStatus(404);
  }
};
