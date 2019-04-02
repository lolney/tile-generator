import ee from "@google/earthengine";
import { reduceRegions } from "./tileAnalysis";

// Map image:
// set isForest
// set isWetland

export default function(grid) {
  var dataset = ee
    .ImageCollection("JAXA/ALOS/PALSAR/YEARLY/FNF")
    .filterDate("2017-01-01", "2017-12-31")
    .first();
  var mask = dataset.select("fnf");

  /* var dataset = ee.Image("COPERNICUS/CORINE/V18_5_1/100m/2012");
  var mask = dataset.select("landcover");*/

  return reduceRegions(mask, grid);
}
