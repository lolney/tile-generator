import ee from "@google/earthengine";
import createRawHexGrid from "../../common/createRawHexGrid";

export default function(args) {
  const rawGrid = createRawHexGrid(args);
  const polys = rawGrid.map((hex, i) =>
    ee.Feature(ee.Geometry.Polygon(hex), {
      label: i
    })
  );
  var grid = ee.FeatureCollection(polys);

  return grid;
}
