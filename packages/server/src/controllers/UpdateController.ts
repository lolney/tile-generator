import requests from "../db/openRequest";
import { Request, Response } from "express";
import OpenRequest from "./OpenRequest";

export default async function UpdateController(req: Request, res: Response) {
  const request = OpenRequest.parseRequest(req.body);
  const id = request.id;
  requests.set(id, request);

  req.on("close", () => {
    console.log(`disconnected: ${id}`);
    requests.delete(id);
  });

  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader("Transfer-Encoding", "chunked");

  for await (const result of request.completeJobs()) {
    if (!requests.has(id)) {
      console.log(`Request ${id} no longer exists. Aborting.`);
      break;
    }
    res.write(JSON.stringify(result.createEvent()) + "\n");
  }
  res.end();
}
