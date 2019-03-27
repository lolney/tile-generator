import Map from "../map/Map";
import {
  MapOptionsT,
  MapOptions,
  GameString,
  Tile,
  MapConfigurable
} from "../../common/types";
import { failure } from "io-ts";
import uuidv4 from "uuid/v4";
import createRawHexGrid from "../../common/createRawHexGrid";
import CivVMapWriter from "../map/CivVMapWriter";
import CivVMap from "../map/CivVMap";
import EarthEngine from "../earth-engine/EarthEngine";
import { Polygon } from "geojson";
import Civ6Map from "../map/Civ6Map";
import Civ6MapWriter from "../map/Civ6MapWriter";

export const N_LAYERS = 3;

interface MapInterface {
  new (tiles: number | Tile[], params: MapConfigurable): Map;
}

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

    let MapType = OpenRequest.getMapType(req.format);

    const map = new MapType(width * height, {
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
      earthEngine.createElevationTiles,
      earthEngine.createClimateTiles,
      earthEngine.createForestTiles
    ]) {
      let tiles = await method.bind(earthEngine)(this.grid);
      this.map.addLayer(tiles);
      yield this.map.tiles;
    }
    this.complete = true;
  }

  async createFile(): Promise<Buffer> {
    const writer = OpenRequest.getMapWriter(this.map);
    return writer.write();
  }

  getFileName(): string {
    if (this.map instanceof Civ6Map) {
      return `${this.map.metadata.ID}.Civ6Map`;
    } else if (this.map instanceof CivVMap) {
      return `${this.map.header.name}.Civ5Map`;
    } else {
      throw new Error("Unexpected map type");
    }
  }

  static getMapType(format: GameString): MapInterface {
    switch (format) {
      case "Civ V":
        return CivVMap;
      case "Civ VI":
        return Civ6Map;
    }
  }

  static getMapWriter(map: Map) {
    if (map instanceof Civ6Map) {
      return new Civ6MapWriter(map, `./${map.metadata.ID}.Civ6Map`);
    } else if (map instanceof CivVMap) {
      return new CivVMapWriter(map);
    } else {
      throw new Error("Unexpected map type");
    }
  }
}
