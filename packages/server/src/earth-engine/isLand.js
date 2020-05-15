import ee from "@google/earthengine";
import { reduceRegions } from "./tileAnalysis";

export const IS_WATER_IF_GREATER_THAN = 0.35;

function setIsLand(square) {
  var mean = square.get("mean");
  // water mask is 1. if gt .5, then is water; else land.
  var land = ee.Algorithms.If(
    ee.Number(mean).gt(IS_WATER_IF_GREATER_THAN),
    0,
    1
  );
  return square.set({ isLand: land });
}

/**
 *
 * @param {ee.FeatureCollection} grid
 */
export default function (grid) {
  var hasMean = ee.Filter.neq("mean", undefined);

  var dataset = ee.Image("MODIS/MOD44W/MOD44W_005_2000_02_24");
  var waterMask = dataset.select("water_mask");

  var waterTiles = reduceRegions(waterMask, grid)
    .filter(hasMean)
    .map(setIsLand);

  return waterTiles;
}
