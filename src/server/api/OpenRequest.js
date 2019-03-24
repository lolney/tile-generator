import Map from "../map/Map";
import createHexGrid from "../earth-engine/createHexGrid";
import { MapOptionsT } from "../../common/types";
import { failure } from "io-ts";
import uuidv4 from "uuid/v4";

export const N_LAYERS = 2;

export default class OpenRequest {
  constructor(earthEngine) {
    this.earthEngine = earthEngine;
    this.id = uuidv4();
  }

  parseRequest(req) {
    // Validate request
    const options = MapOptionsT.decode(req).getOrElseL(errors => {
      console.log(errors);
      throw new Error(failure(errors).join("\n"));
    });

    const { width, height } = options.dimensions;

    // Start jobs
    this.grid = createHexGrid({
      width,
      height,
      lon_start: options.bounds._southWest.lng,
      lon_end: options.bounds._northEast.lng,
      lat_start: options.bounds._southWest.lat
    });

    this.map = new Map(width * height);

    return this.earthEngine.extractGeometry(this.grid);
  }

  *completeJobs() {
    for (const method of [
      this.earthEngine.createLandTiles,
      this.earthEngine.createElevationTiles
    ]) {
      let tiles = method(this.grid);
      this.map.addLayer(tiles);
      yield this.map.tiles;
    }
  }
}
