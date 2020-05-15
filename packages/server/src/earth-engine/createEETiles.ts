import { Polygon } from "geojson";
import createHexGrid from "./createHexGrid";
import { Tile } from "@tile-generator/common";

export function createEETiles(
  analysis: Function,
  process: (properties: any, geometry: Polygon) => Promise<Tile> | Tile
) {
  const earthGrid = createHexGrid(this.grid);
  const featureCollection = analysis(earthGrid);

  // Note: with large tile sizes, there's a problem with this stage
  // Can try first exporting to drive, then loading from there
  // Or, actually seems to be a problem with sending too much?
  const local = featureCollection.getInfo();

  return local.features.map((feature: any) => {
    return process(feature.properties, feature.geometry);
  });
}
