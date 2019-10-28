import { MapConfigurable } from "../../common/types";
import Civ6Map from "./Civ6Map";

describe("getRiverType", () => {
  const base: MapConfigurable = {
    width: 2,
    height: 2,
    nPlayers: 1,
    description: "",
    name: ""
  };

  it("affects self", () => {
    const map = new Civ6Map([{ river: { east: true } }, {}, {}, {}], base);

    const plotRivers = map.getRiverType(map.tiles[0], 0);

    expect(plotRivers.IsWOfRiver).toEqual(true);
  });

  /* This functionality has been moved to TilesMap
  it("affects west, northWest, southWest neighbors", () => {
    const map = new Civ6Map([{}, { river: { west: true } }, {}, {}], base);

    const plotRivers = map.getRiverType(map.tiles[1], 1);

    expect(plotRivers).toHaveLength(1);
    expect(plotRivers.IsWOfRiver).toEqual(true);
    expect(plotRivers.ID).toEqual(0);
  });

  it("can rewrite tiles that are affected by rivers on multiple tiles", () => {
    const map = new Civ6Map(
      [{ river: { east: true } }, {}, {}, { river: { northWest: true } }],
      base
    );

    const plotRivers = map.getRiverType(map.tiles[0], 0,);
    const plotRivers = map.getRiverType(map.tiles[3], 3);

    expect(result).toHaveLength(1);
    expect(result[0].IsWOfRiver).toEqual(true);
    expect(result[0].IsNWOfRiver).toEqual(true);
  });
  */
});
