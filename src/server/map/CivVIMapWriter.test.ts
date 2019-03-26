import { readDb } from "./CivVIMapWriter";

describe("Civ6", () => {
  it("MapWriter", async () => {
    console.log(await readDb());
  });
});
