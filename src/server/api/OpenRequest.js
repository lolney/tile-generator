import Map from "../map/Map";
import createHexGrid from "../earth-engine/createHexGrid";

export default class OpenRequest {
  constructor(earthEngine) {
    this.earthEngine = earthEngine;
    this.map = new Map(16);
  }

  parseRequest(req) {
    // Validate request -> map
    // Start jobs
    /*const grid = createHexGrid({
      width: req.width,
      height: req.height,
      lon_start: req.lon_start,
      lon_end: req.lon_end,
      lat_start: req.lat_start
    });*/
    const grid = createHexGrid({
      width: 5,
      height: 5,
      lon_start: 0,
      lon_end: 100,
      lat_start: 0
    });

    const tiles = this.earthEngine.createLandTiles(grid);
    this.map.addLayer(tiles);

    // On all jobs complete: create outputed map
    return this.map.tiles;
  }
}
