import Map from "../map/Map";

export default class OpenRequest {
  constructor(earthEngine) {
    this.earthEngine = earthEngine;
    this.map = new Map(16);
  }

  parseRequest(req) {
    // Validate request -> map
    // Start jobs
    const tiles = this.earthEngine.createLandTiles();
    this.map.addLayer(tiles);

    // On all jobs complete: create outputed map
    return this.map.tiles;
  }
}
