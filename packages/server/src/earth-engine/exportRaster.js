export function exportRaster(image, tableName) {
  var westernHemisphere = {
    type: "Polygon",
    coordinates: [
      [
        [-180, -90],
        [-180, 90],
        [0, 90],
        [0, -90],
        [-180, -90],
      ],
    ],
  };

  var easternHemisphere = {
    type: "Polygon",
    coordinates: [
      [
        [0, -90],
        [0, 90],
        [180, 90],
        [180, -90],
        [0, -90],
      ],
    ],
  };

  Export.image.toDrive({
    image: image,
    description: tableName + "_west",
    scale: 500,
    shardSize: 1024,
    folder: "earthEngine",
    crs: "EPSG:4326",
    maxPixels: 32 * 1e9,
    region: ee.Geometry(westernHemisphere),
  });

  Export.image.toDrive({
    image: image,
    scale: 500,
    shardSize: 1024,
    folder: "earthEngine",
    crs: "EPSG:4326",
    maxPixels: 32 * 1e9,
    description: tableName + "_east",
    region: ee.Geometry(easternHemisphere),
  });
}
