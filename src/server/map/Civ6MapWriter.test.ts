import Civ6MapWriter from "./Civ6MapWriter";
import Civ6Map from "./Civ6Map";
import { TerrainType, Elevation } from "../../common/types";

const testMap = new Civ6Map(
  [
    { terrain: TerrainType.ocean },
    { terrain: TerrainType.desert },
    { terrain: TerrainType.grass },
    { terrain: TerrainType.grass, elevation: Elevation.mountain },
  ],
  {
    name: "test",
    width: 2,
    height: 2,
    nPlayers: 1,
    description: "",
  }
);

describe("Civ6", () => {
  it("MapWriter correctly writes tiles", async () => {
    const writer = new Civ6MapWriter(testMap);

    await writer.createDb();

    const plots = await writer.getPlots();

    expect(plots).toHaveLength(4);
    expect(plots[0].TerrainType).toBe("TERRAIN_GRASS");
    expect(plots[0].ID).toBe(0);
  });

  it("getQueryFromEntries", async () => {
    const writer = new Civ6MapWriter(testMap);

    console.log(writer.getQueryFromEntries("Map", [writer.map.map]));
  });
});
