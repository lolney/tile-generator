import ee from "@google/earthengine";
import { reduceRegions } from "./tileAnalysis";

export default function (grid) {
  var dataset = ee
    .ImageCollection("JAXA/ALOS/PALSAR/YEARLY/FNF")
    .filterDate("2017-01-01", "2017-12-31")
    .first();
  var mask = dataset.select("fnf");

  return reduceRegions(mask, grid);
}
