import requests from "../db/openRequest";
import { Request, Response } from "express";
import { ISseResponse } from "@toverux/expresse";

export default async function UpdateController(
  req: Request,
  res: ISseResponse
) {
  const { id } = req.params;
  const request = requests.get(id);

  req.on("close", () => {
    console.log(`disconnected: ${id}`);
    requests.delete(id);
  });

  if (request) {
    for await (const result of request.completeJobs()) {
      if (!requests.has(id)) {
        console.log(`Request ${id} no longer exists. Aborting.`);
        break;
      }
      result.createEvent(res.sse);
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
