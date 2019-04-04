import {
  getClimateType,
  getClimateTypeSampled,
  getClimateTypeSingle
} from "./koppen";
import { Koppen } from "../../common/types";
import { Polygon } from "geojson";
import _ from "lodash";

describe("koppen", () => {
  it("getClimateType on land", async () => {
    const type = await getClimateTypeSingle(10, 10);
    expect(type).toEqual(Koppen.Aw);
  });

  it("getClimateType in Ocean", async () => {
    const type = await getClimateTypeSingle(0, 0);
    expect(type).toEqual(Koppen.Ocean);
  });

  it("getClimateType for invalid coords", async () => {
    const type = await getClimateTypeSingle(100, 100);
    expect(type).toEqual(undefined);
  });
});

const easternUS: Polygon = {
  type: "Polygon",
  coordinates: [[[-100, 30], [-100, 50], [-80, 50], [-80, 30], [-100, 30]]]
};

describe("koppen sampled", () => {
  it("returns proper values for the eastern US", async () => {
    const result = await getClimateTypeSampled(easternUS, 40);
    const types = result.map(([climate, _]) => climate);

    expect(types).toContain(Koppen.Cfa);
    expect(types).toContain(Koppen.Dfa);
    expect(types).toContain(Koppen.Dfb);
  });

  it("aggregates properly over eastern US", async () => {
    const result = await getClimateType(easternUS);

    expect([Koppen.Dfb, Koppen.Cfa]).toContain(result);
  });

  it("over a small area, returns the same result as getClimateType", async () => {
    const poly: Polygon = {
      type: "Polygon",
      coordinates: [
        [[0, 0], [0.1, 0], [0.1, 0.05], [0, 0]].map(([lng, lat]) => [
          lng + 10,
          lat + 10
        ])
      ]
    };

    const sampled = await getClimateTypeSampled(poly, 10);
    const single = await getClimateTypeSingle(10, 10);
    const main = await getClimateType(poly);

    expect(single).toEqual(sampled[0][0]);
    expect(single).toEqual(main);
  });
});
