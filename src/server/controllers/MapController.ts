import requests from "../db/openRequest";
import { Request, Response } from "express";

export default async function MapController(req: Request, res: Response) {
  const request = requests.get(req.params.id);

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
}
