// @ts-ignore
import ee from "@google/earthengine";
import { Polygon } from "geojson";

export default function(rawGrid: Array<Polygon>) {
  const polys = rawGrid.map((hex, i) =>
    ee.Feature(ee.Geometry.Polygon(hex.coordinates[0]), {
      label: i
    })
  );
  var grid = ee.FeatureCollection(polys);

  return grid;
}
