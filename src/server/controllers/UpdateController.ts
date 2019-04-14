import requests from "../db/openRequest";
import { Request, Response } from "express";
import { nextTick } from "q";

export default async function UpdateController(req: Request, res: Response) {
  const request = requests.get(req.params.id);
  for await (const layer of request.completeJobs()) {
    // @ts-ignore
    res.sse("layer", {
      layer
    });
  }
}

export const UpdateExistsMiddleware = (
  req: Request,
  res: Response,
  next: () => void
) => {
  if (!requests.has(req.params.id)) {
    res.sendStatus(404);
  } else {
    next();
  }
};
