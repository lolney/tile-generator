import ee from "@google/earthengine";
import { reduceRegions } from "./tileAnalysis";

export default function(grid) {
  var dataset = ee.Image("CGIAR/SRTM90_V4");
  var elevation = dataset.select("elevation");
  var slope = ee.Terrain.slope(elevation);

  var slopeTiles = reduceRegions(slope, grid);

  return slopeTiles;
}
