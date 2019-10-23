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
    const map = new Civ6Map([{ river: { east: true } }, {}, {}, {}], base);

    const plotRivers = map.getRiverType(map.tiles[0], 0);

    expect(plotRivers.IsWOfRiver).toEqual(true);
  });
});
