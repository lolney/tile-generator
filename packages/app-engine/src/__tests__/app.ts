import waitPort from "wait-port";
import request from "supertest";
import http from "http";
import createServer, { limits } from "../server";

const PORT = parseInt(process.env.PORT, 10) || 8888;

let server: http.Server;

beforeEach(() => {
  server = createServer(["trust proxy"]);
});

afterEach(() => {
  server.close();
});

describe("server listening", () => {
  it("should be listening", async () => {
    const isOpen = await waitPort({ port: PORT });
    expect(isOpen).toBe(true);
  });
});

describe("/", () => {
  it("should rate limit after x requests", async () => {
    for (const _ of Array(limits.maxPerIP - 1))
      await request(server).get("/").expect(200);

    await request(server).get("/").expect(429);
  });

  it("should rate limit globally after x requests", async () => {
    for (const i of Array(limits.maxGlobal - 1)
      .fill(0)
      .map((_, j) => j)) {
      await request(server)
        .get("/")
        .set("X-Forwarded-For", `192.${i}.2.1`)
        .expect(200);
    }

    await request(server).get("/").expect(429);
  });
});
