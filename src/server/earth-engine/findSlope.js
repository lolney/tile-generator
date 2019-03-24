import ee from "@google/earthengine";
import { createFindMean } from "./tileAnalysis";

export default function(grid) {
  var dataset = ee.Image("CGIAR/SRTM90_V4");
  var elevation = dataset.select("elevation");
  var slope = ee.Terrain.slope(elevation);

  const findMean = createFindMean(slope, "slope");

  var slopeTiles = grid.map(findMean);

  return slopeTiles;
}
