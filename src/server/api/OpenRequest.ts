import Map from "../map/Map";
import { MapOptionsT, MapOptions } from "../../common/types";
import { failure } from "io-ts";
import uuidv4 from "uuid/v4";
import createRawHexGrid from "../../common/createRawHexGrid";
import CivVMapWriter from "../map/CivVMapWriter";
import CivVMap from "../map/CivVMap";
import EarthEngine from "../earth-engine/EarthEngine";
import { Polygon } from "geojson";

export const N_LAYERS = 1;

export default class OpenRequest {
  complete: boolean;
  grid: Polygon[];
  map: Map;
  id: string;

  constructor(grid: Polygon[], map: Map) {
    this.id = uuidv4();
    this.complete = false;
    this.grid = grid;
    this.map = map;
  }

  static parseRequest(req: MapOptions) {
    // Validate request
    const options = MapOptionsT.decode(req).getOrElseL(errors => {
      console.log(errors);
      //@ts-ignore
      throw new Error(failure(errors).join("\n"));
    });

    const { width, height } = options.dimensions;

    // Start jobs
    const grid = createRawHexGrid({
      width,
      height,
      lon_start: options.bounds._southWest.lng,
      lon_end: options.bounds._northEast.lng,
      lat_start: options.bounds._southWest.lat
    });

    const map = new CivVMap(width * height, {
      width,
      height,
      nPlayers: 6,
      name: "map",
      description: ""
    });

    return new OpenRequest(grid, map);
  }

  async *completeJobs(earthEngine: EarthEngine) {
    for (const method of [
      //this.earthEngine.createLandTiles,
      //this.earthEngine.createElevationTiles,
      earthEngine.createClimateTiles
      //this.earthEngine.createForestTiles
    ]) {
      let tiles = await method.bind(earthEngine)(this.grid);
      this.map.addLayer(tiles);
      yield this.map.tiles;
    }
    this.complete = true;
  }

  createFile(): Buffer {
    const writer = new CivVMapWriter(<CivVMap>this.map);
    return writer.write();
  }
}
