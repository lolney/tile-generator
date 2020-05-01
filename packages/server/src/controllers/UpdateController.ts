import requests from "../db/openRequest";
import { Request, Response } from "express";

export default async function UpdateController(req: Request, res: Response) {
  const request = requests.get(req.params.id);
  if (request) {
    for await (const layer of request.completeJobs()) {
      // @ts-ignore
      res.sse("layer", {
        layer,
      });
    }
  } else {
    throw new Error(`Requested map ID that does not exist: ${req.params.id}`);
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