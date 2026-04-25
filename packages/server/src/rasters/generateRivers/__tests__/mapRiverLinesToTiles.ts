import { createRawHexGrid, TerrainType } from "@tile-generator/common";
import mapRiverLinesToTiles, { mapRiverLinesToMask } from "../mapRiverLinesToTiles";
import { LineString } from "geojson";

describe("mapRiverLinesToTiles", () => {
  const [tile] = createRawHexGrid({
    width: 1,
    height: 1,
    lon_start: 0,
    lon_end: 1,
    lat_start: 1,
    lat_end: 0,
  });

  it("returns a full tile array for real line intersections", () => {
    const line: LineString = {
      type: "LineString",
      coordinates: [
        [-0.1, 0.5],
        [1.1, 0.5],
      ],
    };

    const [result] = mapRiverLinesToTiles(
      [tile],
      [line],
      [{ terrain: TerrainType.grass }],
      { width: 1, height: 1 }
    );

    expect(result).toBeDefined();
  });

  it("maps real line intersections onto a tile mask", () => {
    const line: LineString = {
      type: "LineString",
      coordinates: [
        [-0.1, 0.5],
        [1.1, 0.5],
      ],
    };

    const result = mapRiverLinesToMask(
      [tile],
      [line],
      [{ terrain: TerrainType.grass }],
      { width: 1, height: 1 }
    );

    expect(result.get(0, 0)).toBe(true);
  });

  it("does not draw river edges inside ocean tiles", () => {
    const line: LineString = {
      type: "LineString",
      coordinates: [
        [-0.1, 0.5],
        [1.1, 0.5],
      ],
    };

    const result = mapRiverLinesToTiles(
      [tile],
      [line],
      [{ terrain: TerrainType.ocean }],
      { width: 1, height: 1 }
    );

    expect(result).toHaveLength(1);
    expect(result[0].river).toBeUndefined();
  });
});
