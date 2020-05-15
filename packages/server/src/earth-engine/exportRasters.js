import ee from "@google/earthengine";
import { exportRaster } from "./exportRaster";

function getSlopeDataset() {
  var dataset = ee.Image("CGIAR/SRTM90_V4");
  var elevation = dataset.select("elevation");
  var slope = ee.Terrain.slope(elevation);

  return slope;
}

function getWatermaskDataset() {
  var dataset = ee.Image("MODIS/MOD44W/MOD44W_005_2000_02_24");
  var waterMask = dataset.select("water_mask");

  return waterMask;
}

function getMarshDataset() {
  var dataset = ee.ImageCollection("MODIS/006/MCD12Q1").select("LC_Type1");

  var marsh = ee.List([11]);

  var mask = dataset
    .map(function (image) {
      return image.remap({
        from: marsh,
        to: ee.List.repeat(1, marsh.size()),
        defaultValue: 0,
      });
    })
    .select("remapped");

  var image = mask.reduce(ee.Reducer.bitwiseOr());

  return image;
}

function getForestDataset() {
  var dataset = ee
    .ImageCollection("JAXA/ALOS/PALSAR/YEARLY/FNF")
    .filterDate("2017-01-01", "2017-12-31")
    .first();
  var mask = dataset.select("fnf");

  return mask;
}

function getFlowDataset() {
  var dataset = ee.Image("WWF/HydroSHEDS/30ACC");
  var flowAccumulation = dataset.select("b1");

  return flowAccumulation;
}

function exportAll() {
  exportRaster(getWatermaskDataset(), "watermask_500");
  exportRaster(getSlopeDataset(), "slope_500");
  exportRaster(getForestDataset(), "forest_500");
  exportRaster(getMarshDataset(), "marsh_500");
  exportRaster(getFlowDataset(), "flow_500");
}
