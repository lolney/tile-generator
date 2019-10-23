import generateRivers from "../index";
import { Polygon } from "geojson";
import eureka from "../../../../fixtures/eureka.json";

describe("generateRivers", () => {
  it("returns an array of tiles", async () => {
    // todo: find a fixture with realistic data
    const tiles: Polygon[] = [
      {
        // connecticut river
        type: "Polygon",
        coordinates: [
          [
            [-72.501716, 42.741314],
            [-72.431966, 42.741314],
            [-72.431966, 42.699798],
            [-72.431966, 42.699798],
            [-72.501716, 42.741314]
          ]
        ]
      }
    ];
    const dimensions = { width: 10, height: 10 };
    const rivers = await generateRivers(tiles, dimensions);

    expect(rivers).toBeDefined();
  });

  it("returns an array of tiles", async () => {
    const tiles: Polygon[] = eureka as Polygon[];

    const dimensions = { width: 10, height: 10 };
    const rivers = await generateRivers(tiles, dimensions);

    expect(rivers).toBeDefined();
  });
});
