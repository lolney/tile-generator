import request from "supertest";
import express, { Express } from "express";
// @ts-ignore
import sse from "@toverux/expresse";
import UpdateController, { UpdateExistsMiddleware } from "./UpdateController";

describe("UpdateController", () => {
  let app: Express;

  beforeAll(() => {
    /*jest.mock("../db/openRequest", () => ({
      default: {
        get: () => ({
          completeJobs: async function*() {
            yield 1;
          }
        })
      }
    }));
    UpdateController = require("./UpdateController");*/

    app = express();
    app.get("/updates/:id", UpdateExistsMiddleware, sse, UpdateController);
  });

  it("Sends 404 if an invalid map id is requested", (done) => {
    request(app).get("/updates/sdf").expect(404).end(done);
  });
});
