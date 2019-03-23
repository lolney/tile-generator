import Map from "../map/Map";
import createHexGrid from "../earth-engine/createHexGrid";
import { MapOptionsT } from "../../common/types";
import { failure } from "io-ts";

export default class OpenRequest {
  constructor(earthEngine) {
    this.earthEngine = earthEngine;
    this.map = new Map(16);
  }

  parseRequest(req) {
    // Validate request
    const options = MapOptionsT.decode(req).getOrElseL(errors => {
      throw new Error(failure(errors).join("\n"));
    });

    // Start jobs
    const grid = createHexGrid({
      width: options.dimensions.width,
      height: options.dimensions.height,
      lon_start: options.bounds._southWest.lng,
      lon_end: options.bounds._northEast.lng,
      lat_start: options.bounds._northEast.lat
    });

    return this.earthEngine.extractGeometry(grid);
    // TODO: make these separate events

    // Create layers

    const tiles = this.earthEngine.createLandTiles(grid);
    this.map.addLayer(tiles);

    // On all jobs complete: create outputed map
    return this.map.tiles;
  }
}
