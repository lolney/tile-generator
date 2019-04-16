import app from "./main";
import request from "supertest";

/* 
Requires ejecting and running tests with babel
Or creating a babel hook?
describe("api", () => {
  beforeAll(async () => {
    await app;
  });

  describe("POST api/map", () => {
    it("returns bounds", done => {
      request(app)
        .post("api/map")
        .expect(200, {}, err => {})
        .end(done);
    });
  });

  describe("GET updates/id", () => {
    it("gets x updates, where x = nLayers", () => {});
  });

  describe("GET api/map/id", () => {
    it("returns null when x", () => {});
  });
});
*/
