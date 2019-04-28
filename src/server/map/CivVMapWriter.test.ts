import CivVMapWriter from "./CivVMapWriter";
import CivVMap from "./CivVMap";
import { TILE_SIZE } from "./MapWriter";

describe("CivVMapWriter", () => {
  const config = {
    width: 10,
    height: 10,
    nPlayers: 2,
    name: "a",
    description: "b"
  };

  it("writes map header without errors", () => {
    const map = new CivVMap([], config);
    const writer = new CivVMapWriter(map);

    //@ts-ignore
    writer.writeHeader();

    //@ts-ignore
    expect(writer.buffer).toBeInstanceOf(Buffer);
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
});
