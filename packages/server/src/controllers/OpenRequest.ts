import Map from "../map/Map";
import {
  MapOptionsT,
  MapOptions,
  GameString,
  Tile,
  MapConfigurable,
  MapLayers,
  Options,
} from "@tile-generator/common";
import uuidv4 from "uuid/v4";
import { createRawHexGrid } from "@tile-generator/common";
import CivVMapWriter from "../map/CivVMapWriter";
import CivVMap from "../map/CivVMap";
import { Polygon } from "geojson";
import Civ6Map from "../map/Civ6Map";
import Civ6MapWriter from "../map/Civ6MapWriter";
import { LatLngBounds } from "leaflet";
import MapBuilder from "../map/MapBuilder";
import { CivMapWriter } from "types/maps";
import MapReader from "../map/MapReader";
import { uploadFile } from "../services/cloudStorage";
import { ISseFunctions } from "@toverux/expresse";
import Errors from "../map/Errors";

export const N_LAYERS = Object.values(MapLayers).filter(
  (val) => typeof val === "string"
).length;

interface MapInterface {
  new (tiles: number | Tile[], params: MapConfigurable): Map;
}

interface OpenRequestResult {
  createEvent: (sse: ISseFunctions) => void;
}

class LayerResult implements OpenRequestResult {
  constructor(public layer: { [x: number]: Tile[] }) {}

  createEvent = (sse: ISseFunctions) => {
    sse.event("layer", {
      layer: this.layer,
    });
  };
}

class ErrorResult implements OpenRequestResult {
  constructor(public errors: Errors) {}

  createEvent = (sse: ISseFunctions) => {
    sse.event("errors", {
      errors: this.errors.serialize(),
    });
  };
}

class DownloadResult implements OpenRequestResult {
  constructor(public url: string) {}

  createEvent = (sse: ISseFunctions) => {
    sse.event("downloadUrl", {
      url: this.url,
    });
  };
}

export default class OpenRequest {
  complete: boolean;
  mapBuilder: MapBuilder;
  map: Map;
  id: string;

  constructor(
    grid: Polygon[],
    map: Map,
    bounds: LatLngBounds,
    options: Options
  ) {
    this.id = uuidv4();
    this.complete = false;
    this.mapBuilder = new MapBuilder(grid, bounds, options);
    this.map = map;
  }

  static parseRequest(req: MapOptions) {
    const options = MapOptionsT.decode(req).getOrElseL((errors: any[]) => {
      console.error(errors);
      throw new Error(errors.map((val) => val.message).join("\n"));
    });

    const { width, height } = options.dimensions;
    const bounds = MapBuilder.deserializeBounds(options.bounds);

    const grid = createRawHexGrid({
      width,
      height,
      lon_start: bounds.getWest(),
      lon_end: bounds.getEast(),
      lat_start: bounds.getNorth(),
      lat_end: bounds.getSouth(),
    });

    let MapType = OpenRequest.getMapType(req.format);

    const map = new MapType(width * height, {
      width,
      height,
      nPlayers: 6,
      name: uuidv4(),
      description: "",
    });

    return new OpenRequest(grid, map, bounds, options);
  }

  async *completeJobs() {
    const layers = [
      MapLayers.climate,
      MapLayers.elevation,
      MapLayers.forest,
      MapLayers.rivers,
      MapLayers.marsh,
    ];
    for (const layer of layers) {
      console.log("Starting layer", layer);
      let tiles = await this.mapBuilder.createLayer(layer);
      this.map.addLayer(tiles);
      yield new LayerResult({ [MapLayers[layer]]: tiles });
    }

    console.log(JSON.stringify(this.map.tiles));

    const [buffer, errors] = await this.createFile();
    const url = await uploadFile(this.getFileName(), buffer);

    yield new ErrorResult(errors);
    if (url?.[0]) yield new DownloadResult(url?.[0]);

    this.complete = true;
  }

  async createFile() {
    const writer = OpenRequest.getMapWriter(this.map);
    return writer.write();
  }

  async readFile() {
    return MapReader.readFile(this.getFileName());
  }

  getFileName(): string {
    return this.map.filename;
  }

  static getMapType(format: GameString): MapInterface {
    switch (format) {
      case "Civ V":
        return CivVMap;
      case "Civ VI":
        return Civ6Map;
    }
  }

  static getMapWriter(map: Map): CivMapWriter {
    if (map instanceof Civ6Map) {
      return new Civ6MapWriter(map, map.filename);
    } else if (map instanceof CivVMap) {
      return new CivVMapWriter(map);
    } else {
      throw new Error("Unexpected map type");
    }
  }
}
