import { createRawHexGrid, TerrainType } from "@tile-generator/common";
import mapRiverLinesToTiles from "../mapRiverLinesToTiles";
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

  it("maps real line intersections onto tile river edges", () => {
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
      [{ terrain: TerrainType.grass }]
    );

    expect(result.river).toBeDefined();
    expect(Object.values(result.river ?? {}).filter(Boolean).length).toBe(2);
  });

  it("does not draw river edges inside ocean tiles", () => {
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
      [{ terrain: TerrainType.ocean }]
    );

    expect(result.river).toBeUndefined();
  });
});
