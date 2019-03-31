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
import { Polygon } from "geojson";
import Civ6Map from "../map/Civ6Map";
import Civ6MapWriter from "../map/Civ6MapWriter";
import { LatLngBounds } from "leaflet";
import MapBuilder from "../map/MapBuilder";

export const N_LAYERS = 5;

interface MapInterface {
  new (tiles: number | Tile[], params: MapConfigurable): Map;
}

export default class OpenRequest {
  complete: boolean;
  mapBuilder: MapBuilder;
  map: Map;
  id: string;

  constructor(grid: Polygon[], map: Map, bounds: LatLngBounds) {
    this.id = uuidv4();
    this.complete = false;
    this.mapBuilder = new MapBuilder(grid, bounds);
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
    const bounds = MapBuilder.deserializeBounds(options.bounds);

    // Start jobs
    const grid = createRawHexGrid({
      width,
      height,
      lon_start: bounds.getWest(),
      lon_end: bounds.getEast(),
      lat_start: bounds.getSouth()
    });

    let MapType = OpenRequest.getMapType(req.format);

    const map = new MapType(width * height, {
      width,
      height,
      nPlayers: 6,
      name: "map",
      description: ""
    });

    return new OpenRequest(grid, map, bounds);
  }

  async *completeJobs() {
    for (const method of [
      this.mapBuilder.createLandTiles,
      this.mapBuilder.createElevationTiles,
      this.mapBuilder.createClimateTiles,
      this.mapBuilder.createForestTiles,
      this.mapBuilder.createRiverTiles
    ]) {
      let tiles = await method.bind(this.mapBuilder)();
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
