import generateRivers from "../index";
import { Polygon } from "geojson";
import eureka from "../../../fixtures/eureka.json";
import { TerrainType } from "@tile-generator/common";
import { LayerWeightParams } from "../../LayerWeightParams";

const createWaterTiles = (tiles: Polygon[]) =>
  tiles.map(() => ({ terrain: TerrainType.grass }));

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
            [-72.501716, 42.741314],
          ],
        ],
      },
    ];
    const dimensions = { width: 1, height: 1 };
    const rivers = await generateRivers(
      tiles,
      dimensions,
      createWaterTiles(tiles),
      new LayerWeightParams()
    );

    expect(rivers).toBeDefined();
  });

  it("returns an array of tiles with a realistic fixture", async () => {
    const tiles: Polygon[] = eureka as Polygon[];

    const dimensions = { width: 10, height: 10 };
    const rivers = await generateRivers(
      tiles,
      dimensions,
      createWaterTiles(tiles),
      new LayerWeightParams()
    );

    expect(10 * 10).toEqual(eureka.length);
    expect(rivers).toBeDefined();
  });
});
