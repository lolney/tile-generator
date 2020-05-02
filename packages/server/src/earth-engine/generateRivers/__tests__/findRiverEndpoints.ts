import { findSourceTile } from "../findRiverEndpoints";
import { TerrainType, Tile } from "@tile-generator/common";
import { TilesArray } from "@tile-generator/common";

const coast = { terrain: TerrainType.coast };
const land = { terrain: TerrainType.grass };

const waterLayer: Tile[][] = [
  [coast, coast, land],
  [coast, land, land],
  [coast, land, land],
  [coast, coast, land],
  [coast, land, coast],
];

const landLayer: Tile[][] = [
  [land, land, land],
  [land, land, land],
  [land, land, land],
  [land, land, land],
  [coast, land, coast],
];

const riverLayer = [
  [false, false, false],
  [false, true, true],
  [false, false, true],
  [false, false, false],
  [false, false, false],
];

describe("findSourceTile", () => {
  it("should return the river tile with the most coast neighbors", () => {
    const result = findSourceTile(
      TilesArray.from2D(riverLayer),
      TilesArray.from2D(waterLayer)
    );
    expect(result).toEqual([3, 1]);
  });

  it("should return undefined if no coast neighbors", () => {
    const result = findSourceTile(
      TilesArray.from2D(riverLayer),
      TilesArray.from2D(landLayer)
    );
    expect(result).toEqual(undefined);
  });
});
