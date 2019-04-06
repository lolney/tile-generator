import ee from "@google/earthengine";
import { reduceRegions } from "./tileAnalysis";

/**
 *
 * @param {ee.FeatureCollection} grid
 */
export default function(grid) {
  var dataset = ee.ImageCollection("MODIS/006/MCD12Q1").select("LC_Type1");

  var marsh = ee.List([11]);

  var mask = dataset
    .map(image => {
      return image.remap({
        from: marsh,
        to: ee.List.repeat(1, marsh.size()),
        defaultValue: 0
      });
    })
    .select("remapped");

  var image = mask.reduce(ee.Reducer.bitwiseOr());

  // map squares -> means
  var waterTiles = reduceRegions(image, grid);

  return waterTiles;
}
