import Map from "./Map";
import { Tile, TerrainType, FeatureType, Elevation } from "../../common/types";

const config = {
  width: 2,
  height: 4,
  name: "",
  description: "",
  nPlayers: 1,
};

describe("mergeTiles", () => {
  const tiles1: Array<Tile> = [
    { terrain: TerrainType.grass },
    { terrain: TerrainType.tundra },
  ];

  it("creates an initial tile array", () => {
    const map = new Map(2, config);

    map.addLayer(tiles1);

    expect(map.tiles).toEqual(tiles1);
  });

  it("merges an additional tile array", () => {
    const map = new Map(2, config);

    const tiles2: Array<Tile> = [{ feature: FeatureType.forest }, {}];

    map.addLayer(tiles1);
    map.addLayer(tiles2);

    expect(map.tiles).toEqual([
      { terrain: TerrainType.grass, feature: FeatureType.forest },
      { terrain: TerrainType.tundra },
    ]);
  });

  it("overwrites exisitng features with the second", () => {
    const map = new Map(2, config);

    const tiles2: Array<Tile> = [{ terrain: TerrainType.coast }, {}];

    map.addLayer(tiles1);
    map.addLayer(tiles2);

    expect(map.tiles).toEqual([
      { terrain: TerrainType.coast },
      { terrain: TerrainType.tundra },
    ]);
  });

  it("doesn't overwrite water with another feature", () => {
    const map = new Map(2, config);

    const tilesWater: Array<Tile> = [
      { terrain: TerrainType.coast },
      { terrain: TerrainType.coast },
      { terrain: TerrainType.grass },
    ];

    const tiles2: Array<Tile> = [
      { terrain: TerrainType.ocean },
      { terrain: TerrainType.grass },
      { terrain: TerrainType.ocean },
    ];

    map.addLayer(tilesWater);
    map.addLayer(tiles2);

    expect(map.tiles).toEqual([
      { terrain: TerrainType.coast },
      { terrain: TerrainType.coast },
      { terrain: TerrainType.ocean },
    ]);
  });

  it("doesn't overwrite marsh with water", () => {
    const map = new Map(2, config);

    const tiles1: Array<Tile> = [
      { terrain: TerrainType.coast, feature: FeatureType.marsh },
      { terrain: TerrainType.coast },
      { terrain: TerrainType.grass, feature: FeatureType.marsh },
    ];

    const tiles2: Array<Tile> = [
      { terrain: TerrainType.ocean },
      { terrain: TerrainType.grass },
      { terrain: TerrainType.ocean },
    ];

    map.addLayer(tiles1);
    map.addLayer(tiles2);

    expect(map.tiles).toEqual([
      { terrain: TerrainType.grass, feature: FeatureType.marsh },
      { terrain: TerrainType.coast },
      { terrain: TerrainType.grass, feature: FeatureType.marsh },
    ]);
  });

  it("doesn't allow hills or mountain on Ocean", () => {
    const map = new Map(2, config);

    const tiles2: Array<Tile> = [
      { terrain: TerrainType.coast, elevation: Elevation.hills },
      { terrain: TerrainType.coast, elevation: Elevation.mountain },
    ];

    map.addLayer(tiles1);
    map.addLayer(tiles2);

    expect(map.tiles).toEqual([
      { terrain: TerrainType.coast },
      { terrain: TerrainType.coast },
    ]);
  });
});

describe("getNeighboringIndex", () => {
  const map = new Map(8, {
    width: 2,
    height: 4,
    name: "",
    description: "",
    nPlayers: 1,
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
    expect(map.getNeighboringIndex(2, "northEast")).toBe(0);
    expect(map.getNeighboringIndex(4, "northEast")).toBe(3);
  });

  it("returns undefined when northWestern index does not exist", () => {
    expect(map.getNeighboringIndex(2, "northWest")).toBe(undefined);
    expect(map.getNeighboringIndex(0, "northWest")).toBe(undefined);
  });
});
