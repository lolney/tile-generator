import { MapConfigurable } from "../../common/types";
import Civ6Map, { PlotRiversMap } from "./Civ6Map";

describe("getRiverType", () => {
  const base: MapConfigurable = {
    width: 2,
    height: 2,
    nPlayers: 1,
    description: "",
    name: ""
  };

  it("affects self", () => {
    const plotRivers = new PlotRiversMap();
    const map = new Civ6Map([{ river: { east: true } }, {}, {}, {}], base);

    map.getRiverType(map.tiles[0], 0, plotRivers);

    const result = plotRivers.asArray();

    expect(result).toHaveLength(1);
    expect(result[0].IsWOfRiver).toEqual(true);
  });

  // affects west, northWest, southWest neighbors
  it("affects west, northWest, southWest neighbors", () => {
    const plotRivers = new PlotRiversMap();
    const map = new Civ6Map([{}, { river: { west: true } }, {}, {}], base);

    map.getRiverType(map.tiles[1], 1, plotRivers);

    const result = plotRivers.asArray();

    expect(result).toHaveLength(1);
    expect(result[0].IsWOfRiver).toEqual(true);
    expect(result[0].ID).toEqual(0);
  });

  it("can rewrite tiles that are affected by rivers on multiple tiles", () => {
    const plotRivers = new PlotRiversMap();
    const map = new Civ6Map(
      [{}, { river: { east: true } }, { river: { northEast: true } }, {}],
      base
    );

    map.getRiverType(map.tiles[1], 1, plotRivers);
    map.getRiverType(map.tiles[2], 2, plotRivers);

    const result = plotRivers.asArray();

    expect(result).toHaveLength(1);
    expect(result[0].IsWOfRiver).toEqual(true);
    expect(result[0].IsNEOfRiver).toEqual(true);
  });
});
