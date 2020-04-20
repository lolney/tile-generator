import _ from "lodash";
import CivVMapWriter from "./CivVMapWriter";
import CivVMap from "./CivVMap";
import MapWriter, { TILE_SIZE } from "./MapWriter";
import { Tile } from "../../common/types";

describe("CivVMapWriter", () => {
  const config = {
    width: 10,
    height: 10,
    nPlayers: 2,
    name: "a",
    description: "b",
  };

  it("writes map header without errors", () => {
    const map = new CivVMap([], config);
    const writer = new CivVMapWriter(map);
    const mapWriter = new MapWriter(CivVMapWriter.headerLength(map));

    // @ts-ignore
    writer.writeHeader(mapWriter);

    //@ts-ignore
    expect(mapWriter.buffer).toBeInstanceOf(Buffer);
  });

  it("calculates size correctly", () => {
    const map = new CivVMap([], config);

    const size = CivVMapWriter.calcMapLength(map);

    expect(size).toBe(1204);
  });

  it("allocates space according to number of tiles", () => {
    const map1 = new CivVMap([], config);
    const map2 = new CivVMap([{}], config);

    const size1 = CivVMapWriter.calcMapLength(map1);
    const size2 = CivVMapWriter.calcMapLength(map2);

    expect(size2 - size1).toBe(TILE_SIZE);
  });

  it("allocates space according to size of strings", () => {
    const map1 = new CivVMap([], config);
    const map2 = new CivVMap([], { ...config, description: "aaa" });

    const size1 = CivVMapWriter.calcMapLength(map1);
    const size2 = CivVMapWriter.calcMapLength(map2);

    expect(size2 - size1).toBe(2);
  });

  describe("remapTiles", () => {
    const tiles: Tile[] = Array(100)
      .fill(_.random(3))
      .map((rand) => ({ terrain: rand }));
    const map = new CivVMap(tiles, config);
    const writer = new CivVMapWriter(map);

    it("correctly advances up the first column", () => {
      // @ts-ignore
      const iter = writer.remapTiles();
      for (let i = 0; i < config.height; i++) {
        const { value: tile } = iter.next();
        expect(tile).toEqual(map.getTile(config.height - 1 - i, 0));
      }
    });
  });
});
