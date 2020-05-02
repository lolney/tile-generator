import { MapConfigurable, TerrainType } from "@tile-generator/common";
import Civ6Map from "./Civ6Map";

describe("getRiverType", () => {
  const base: MapConfigurable = {
    width: 2,
    height: 2,
    nPlayers: 1,
    description: "",
    name: "",
  };

  it("affects self", () => {
    const map = new Civ6Map([{ river: { east: true } }, {}, {}, {}], base);

    const plotRivers = map.getRiverType(map.tiles[0], 0);

    expect(plotRivers.IsWOfRiver).toEqual(true);
  });

  it("returns flipped tiles with orderedTiles", () => {
    const map = new Civ6Map(
      [
        { terrain: TerrainType.coast },
        { terrain: TerrainType.tundra },
        { terrain: TerrainType.desert },
        { terrain: TerrainType.ice },
        { terrain: TerrainType.ocean },
        { terrain: TerrainType.plains },
      ],
      { ...base, height: 3 }
    );

    const expectedTiles = [
      { terrain: TerrainType.ocean },
      { terrain: TerrainType.plains },
      { terrain: TerrainType.desert },
      { terrain: TerrainType.ice },
      { terrain: TerrainType.coast },
      { terrain: TerrainType.tundra },
    ];

    expect(map.orderedTiles).toEqual(expectedTiles);
  });
});
