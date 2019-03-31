import Map from "./Map";
import { Tile, TerrainType, FeatureType, Elevation } from "../../common/types";

describe("mergeTiles", () => {
  const tiles1: Array<Tile> = [
    { terrain: TerrainType.grass },
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
      { terrain: TerrainType.grass, feature: FeatureType.forest },
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

  it("doesn't allow hills or mountain on Ocean", () => {
    const map = new Map(2);

    const tiles2: Array<Tile> = [
      { terrain: TerrainType.coast, elevation: Elevation.hills },
      { terrain: TerrainType.coast, elevation: Elevation.mountain }
    ];

    map.addLayer(tiles1);
    map.addLayer(tiles2);

    expect(map.tiles).toEqual([
      { terrain: TerrainType.coast },
      { terrain: TerrainType.coast }
    ]);
  });
});

describe("getNeighboringIndex", () => {
  const map = new Map(8, {
    width: 2,
    height: 4,
    name: "",
    description: "",
    nPlayers: 1
  });

  it("returns undefined when asked for an element to west, but on first of row", () => {
    expect(map.getNeighboringIndex(0, "west")).toBe(undefined);
    expect(map.getNeighboringIndex(2, "west")).toBe(undefined);
  });

  it("returns correct western index", () => {
    expect(map.getNeighboringIndex(1, "west")).toBe(0);
    expect(map.getNeighboringIndex(3, "west")).toBe(2);
  });

  it("returns correct northEastern index", () => {
    expect(map.getNeighboringIndex(2, "northEast")).toBe(1);
    expect(map.getNeighboringIndex(4, "northEast")).toBe(2);
  });

  it("returns undefined when northEastern index does not exist", () => {
    expect(map.getNeighboringIndex(3, "northEast")).toBe(undefined);
    expect(map.getNeighboringIndex(0, "northEast")).toBe(undefined);
  });
});
