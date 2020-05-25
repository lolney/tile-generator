import express from "express";
import request from "supertest";
import http from "http";
import { AddressInfo } from "net";
import createServer, { limits } from "../server";

let server: http.Server;
let proxiedServer: http.Server;

const createProxiedServer = () => {
  const proxiedApp = express();

  proxiedApp.get("/", (req, res) => res.send("Hello"));
  proxiedApp.get("/world", (req, res) => res.send("World"));

  return new Promise<http.Server>((resolve) => {
    const newServer = proxiedApp.listen(0, () => {
      resolve(newServer);
    });
  });
};

beforeEach(async () => {
  proxiedServer = await createProxiedServer();
  const { port } = proxiedServer.address() as AddressInfo;
  server = createServer({
    settings: ["trust proxy"],
    port: 0,
    proxyHost: `http://localhost:${port}`,
  });
});

afterEach(() => {
  proxiedServer.close();
  server.close();
});

describe.each(
  ["/limits/global", "/limits/ip"].map(
    (endpoint) => endpoint + "/" + encodeURIComponent("/")
  )
)("%p", (endpoint) => {
  it("should not be rate limited", async () => {
    for (const _ of Array(limits.maxPerIP + 1))
      await request(server).get(endpoint).expect(200);
  });

  it("should return a decreasing remaining and constant limit", async () => {
    const { limit, remaining } = (
      await request(server).get(endpoint).expect(200)
    ).body;
    await request(server).get("/").expect(200);
    const next = (await request(server).get(endpoint).expect(200)).body;

    expect(next.limit).toEqual(limit);
    expect(next.remaining).toEqual(remaining - 1);
  });
});

describe("/", () => {
  it("should rate limit after x requests", async () => {
    for (const _ of Array(limits.maxPerIP))
      await request(server).get("/").expect(200);

    await request(server).get("/").expect(429);
  });

  it("should rate limit after x requests on a particular endpoint (with different urls)", async () => {
    await request(server).get("/?xyz").expect(200);
    for (const _ of Array(limits.maxPerIP - 1))
      await request(server).get("/").expect(200);

    await request(server).get("/").expect(429);
  });

  it("should rate limit after x requests on a particular endpoint", async () => {
    for (const _ of Array(limits.maxPerIP / 2))
      await request(server).get("/world").expect(200);
    for (const _ of Array(limits.maxPerIP))
      await request(server).get("/").expect(200);

    await request(server).get("/").expect(429);
  });

  it("should rate limit globally after x requests", async () => {
    for (const i of Array(limits.maxGlobal)
      .fill(0)
      .map((_, j) => j)) {
      await request(server)
        .get("/")
        .set("X-Forwarded-For", `192.${i}.2.1`)
        .expect(200);
    }

    await request(server).get("/").expect(429);
  });

  it("should proxy requests to proxiedServer, including rate limit headers", async () => {
    const response = await request(server)
      .get("/")
      .expect(200)
      .expect("X-RateLimit-Limit", String(limits.maxPerIP))
      .expect("X-RateLimit-Remaining", String(limits.maxPerIP - 1));
    expect(response.text).toEqual("Hello");
  });
});
