import { map } from "./reducers";

describe("map module", () => {
  describe("submit", () => {
    it("dispatches receiveLayers on success", () => {});
    it("dispatches submitError on failure", () => {});
  });
  describe("receiveLayers", () => {
    it("dispatches receiveGrid", () => {});
  });
  describe("receiveLayer", () => {
    it("dispatches downloadMap if on last layer", () => {});
    it("updates layers", () => {});
  });
  describe("downloadMap", () => {
    it("should reset layer count on success", () => {});
    it("should reset layer count on failure", () => {});
  });
});
