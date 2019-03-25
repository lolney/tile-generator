import Map from "./Map";
import { Tile, TerrainType, FeatureType } from "../../common/types";

describe("mergeTiles", () => {
  const tiles1: Array<Tile> = [
    { terrain: TerrainType.grassland },
    { terrain: TerrainType.tundra }
  ];

  it("creates an initial tile array", () => {
    const map = new Map(2);

    map.addLayer(tiles1);

    expect(map.tiles).toEqual(tiles1);
  });

  it("merges an additional tile array", () => {
    const map = new Map(2);

    const tiles2: Array<Tile> = [{ feature: FeatureType.forest }, {}];

    map.addLayer(tiles1);
    map.addLayer(tiles2);

    expect(map.tiles).toEqual([
      { terrain: TerrainType.grassland, feature: FeatureType.forest },
      { terrain: TerrainType.tundra }
    ]);
  });

  it("overwrites exisitng features with the second", () => {
    const map = new Map(2);

    const tiles2: Array<Tile> = [{ terrain: TerrainType.coast }, {}];

    map.addLayer(tiles1);
    map.addLayer(tiles2);

    expect(map.tiles).toEqual([
      { terrain: TerrainType.coast },
      { terrain: TerrainType.tundra }
    ]);
  });
});
