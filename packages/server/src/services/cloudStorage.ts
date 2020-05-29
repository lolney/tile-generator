import { Storage } from "@google-cloud/storage";
import stream from "stream";
import config from "../config.json";

const storage = new Storage();
const bucketName = "civ-maps";

export const uploadFile = async (filename: string, buffer: Buffer) => {
  if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    console.warn("GOOGLE_APPLICATION_CREDENTIALS not set; skipping upload");
    return `http://localhost:${config.port}`;
  }

  const file = storage.bucket(bucketName).file(filename);
  const bufferStream = new stream.PassThrough();

  bufferStream.end(buffer);

  await new Promise((resolve, reject) =>
    bufferStream
      .pipe(file.createWriteStream())
      .on("error", (err: any) => reject(err))
      .on("finish", () => resolve())
  );

  return file.getSignedUrl({
    action: "read",
    expires: Date.now() + 1000 * 60 * 60 * 24 * 365,
  });
};
