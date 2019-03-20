import ee from "@google/earthengine";

export default function createGrid(lon_start, lon_end, lat_start, lat_end) {
  // 2) Decide no. of (in this case: equally sized) cells
  var num_cells = 16;
  var lon_edge = (lon_end - lon_start) / Math.sqrt(num_cells);
  var lat_edge = (lat_end - lat_start) / Math.sqrt(num_cells);
  // 3) Create the grid
  var polys = [];
  var polys_line = [];
  var cell_id = 0;
  for (var lon = lon_start; lon < lon_end; lon += lon_edge) {
    var x1 = lon;
    var x2 = lon + lon_edge;
    for (var lat = lat_start; lat < lat_end; lat += lat_edge) {
      cell_id = cell_id + 1;
      var y1 = lat;
      var y2 = lat + lat_edge;

      polys.push(
        ee.Feature(ee.Geometry.Rectangle(x1, y1, x2, y2), { label: cell_id })
      );
    }
  }
  var grid = ee.FeatureCollection(polys);
  return grid;
}
