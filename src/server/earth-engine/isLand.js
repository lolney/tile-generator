import createGrid from "./createGrid";
import ee from "@google/earthengine";

function setIsLand(square) {
  var mean = square.get("mean");
  // water mask is 1. if gt .5, then is water; else land.
  var land = ee.Algorithms.If(ee.Number(mean).gt(0.5), 0, 1);
  return square.set({ isLand: land });
}

/**
 *
 * @param {ee.FeatureCollection} grid
 */
export default function(grid) {
  var hasMean = ee.Filter.neq("mean", undefined);

  var dataset = ee.Image("MODIS/MOD44W/MOD44W_005_2000_02_24");
  var waterMask = dataset.select("water_mask");

  if (!grid) grid = createGrid(-180, 180, 0, 90);

  const findMean = square => {
    var meanDictionary = waterMask.reduceRegion({
      reducer: ee.Reducer.mean(),
      geometry: square.geometry(),
      scale: 300,
      maxPixels: 1e9
    });

    var mean = meanDictionary.get("water_mask");
    return square.set({
      mean: mean
    });
  };

  // map squares -> means
  var waterTiles = grid
    .map(findMean)
    .filter(hasMean)
    .map(setIsLand);

  return waterTiles;
  // Paint
  /*
  Map.setCenter(6.746, 46.529, 2);

  var waterMaskVis = {
    min: 0.0,
    max: 1
  };

  var empty = ee.Image().byte();
  var outlines = empty.paint({
    featureCollection: waterTiles,
    color: "isLand"
  });
  var palette = ["00FF00", "0000FF"];
  Map.addLayer(outlines, waterMaskVis, "different color, width edges");
  */
}
