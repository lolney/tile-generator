export default function() {
  var dataset = ee.Image("USGS/GTOPO30");
  var elevation = dataset.select("elevation");
  var elevationVis = {
    min: -10.0,
    max: 8000.0,
    gamma: 1.6
  };

  var lat = [-180, 180];
  var lng = [-90, 90];

  // Polygon covering the world
  var polygon = ee.Geometry.Polygon(
    [[[lat[0], lng[0]], [lat[1], lng[0]], [lat[1], lng[1]], [lat[0], lng[1]]]],
    undefined,
    false
  );

  var polyFeature = ee.Feature(polygon);
  var fromList = ee.FeatureCollection([polyFeature]);

  // Sample every 500km
  var samples = elevation.sampleRegions({
    collection: fromList,
    scale: 500000,
    geometries: true
  });

  print(samples);

  Map.setCenter(0, 0, 4);
  Map.addLayer(samples, null, "Elevation");
  Map.addLayer(polygon, null, "Poly");
}
