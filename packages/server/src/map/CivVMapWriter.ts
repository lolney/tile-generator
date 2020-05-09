import path from "path";
import MapWriter, { MapDataType, TILE_SIZE } from "./MapWriter";
import {
  Tile,
  TerrainType,
  FeatureType,
  RiverType,
} from "@tile-generator/common";
import CivVMap, { terrainTypes, featureTypes, CivVMapHeader } from "./CivVMap";
import FileOverwriter from "./FileOverwriter";
import Errors from "./Errors";
import { CivMapWriter } from "types/maps";

type HeaderFormat = [MapDataType, keyof CivVMapHeader];

const headerFormat: Array<HeaderFormat> = [
  ["byte", "version"],
  ["int", "height"],
  ["int", "width"],
  ["byte", "nPlayers"],
  ["int", "settings"],
  ["length(int)", "terrainTypes"],
  ["length(int)", "featureTypes"],
  ["length(int)", "naturalWonderTypes"],
  ["length(int)", "resourceTypes"],
  ["int0", "version"],
  ["length(int)", "name"],
  ["length(int)", "description"],
  ["stringList", "terrainTypes"],
  ["stringList", "featureTypes"],
  ["stringList", "naturalWonderTypes"],
  ["stringList", "resourceTypes"],
  ["string", "name"],
  ["string", "description"],
  ["length(int)", "mapsize"],
  ["string", "mapsize"],
];

const TEMPLATE_FILE = path.join(__dirname, "../../templates/template.Civ5Map");

export default class CivVMapWriter implements CivMapWriter {
  private map: CivVMap;

  constructor(map: CivVMap) {
    this.map = map;
  }

  static calcMapLength(map: CivVMap) {
    let length = TILE_SIZE * map.tiles.length;
    length += CivVMapWriter.headerLength(map);
    return length;
  }

  static headerLength(map: CivVMap) {
    let length = 0;
    for (const [type, field] of headerFormat) {
      const val = map.header[field];
      length += MapWriter.dataLength(type, val);
    }
    return length;
  }

  write(): Promise<[Buffer, Errors]> {
    this.map.remapRivers();
    return Promise.resolve([this.writeTemplate(), new Errors()]);
  }

  writeNew() {
    const size = CivVMapWriter.calcMapLength(this.map);
    const writer = new MapWriter(size);
    this.writeHeader(writer);

    for (const tile of this.remapTiles()) {
      this.writeTile(writer, tile);
    }

    return writer.buffer;
  }

  writeTemplate() {
    const length = TILE_SIZE * this.map.tiles.length;
    const mapWriter = new MapWriter(length);
    const overwriter = new FileOverwriter(TEMPLATE_FILE, this.map.filename);

    for (const tile of this.remapTiles()) {
      this.writeTile(mapWriter, tile);
    }

    overwriter.overwrite(1, Buffer.from([this.map.configurable.width]));
    overwriter.overwrite(5, Buffer.from([this.map.configurable.height]));
    overwriter.insert(1314, mapWriter.buffer);
    overwriter.writeToFIle();

    return overwriter.buffer;
  }

  private *remapTiles() {
    const { width, height } = this.map.configurable;
    for (let row = height - 1; row >= 0; row--) {
      for (let col = 0; col < width; col++) {
        const tile = this.map.getTile(row, col);
        if (tile !== undefined) yield tile;
      }
    }
  }

  private getTerrainId(terrain: TerrainType | undefined) {
    switch (terrain) {
      case TerrainType.grass:
        return terrainTypes.TERRAIN_GRASS;
      case TerrainType.plains:
        return terrainTypes.TERRAIN_PLAINS;
      case TerrainType.desert:
        return terrainTypes.TERRAIN_DESERT;
      case TerrainType.tundra:
        return terrainTypes.TERRAIN_TUNDRA;
      case TerrainType.ice:
        return terrainTypes.TERRAIN_SNOW;
      case TerrainType.coast:
        return terrainTypes.TERRAIN_COAST;
      case TerrainType.ocean:
        return terrainTypes.TERRAIN_OCEAN;
      default:
        return terrainTypes.TERRAIN_GRASS;
    }
  }

  private getFeatureId(terrain: FeatureType | undefined) {
    switch (terrain) {
      case FeatureType.ice:
        return featureTypes.FEATURE_ICE;
      case FeatureType.jungle:
        return featureTypes.FEATURE_JUNGLE;
      case FeatureType.marsh:
        return featureTypes.FEATURE_MARSH;
      case FeatureType.oasis:
        return featureTypes.FEATURE_OASIS;
      case FeatureType.floodplains:
        return featureTypes.FEATURE_FLOOD_PLAINS;
      case FeatureType.forest:
        return featureTypes.FEATURE_FOREST;
      case FeatureType.fallout:
        return featureTypes.FEATURE_FALLOUT;
      case FeatureType.atoll:
        return featureTypes.FEATURE_ATOLL;
      default:
        return 0xff;
    }
  }

  getRiverByte(river: RiverType | undefined) {
    let bitmask = 0x0;
    if (!river) return bitmask;

    if (river.east) bitmask |= 0x1;
    if (river.northEast) bitmask |= 0x2;
    if (river.northWest) bitmask |= 0x4;
    if (river.southEast) bitmask |= 0x8;
    if (river.southWest) bitmask |= 0x10;
    if (river.west) bitmask |= 0x20;
    return bitmask;
  }

  protected writeTile(writer: MapWriter, tile: Tile) {
    // terrain
    writer.writeByte(this.getTerrainId(tile.terrain));
    // resource
    writer.writeByte(0xff);
    // feature
    writer.writeByte(this.getFeatureId(tile.feature));
    // river
    writer.writeByte(this.getRiverByte(tile.river));
    // elevation
    writer.writeByte(tile.elevation ? tile.elevation : 0x0);
    // continent
    writer.writeByte(0x0);
    // natural wonder
    writer.writeByte(0xff);
    // unknown
    writer.writeByte(0x0);
  }

  private writeHeader(writer: MapWriter) {
    for (const [type, field] of headerFormat) {
      const val = this.map.header[field];

      switch (type) {
        case "byte":
        case "int":
        case "stringList":
        case "string":
        case "tile":
          writer.writeVal(type, val);
          break;
        case "length(int)":
        case "int0":
          const length = MapWriter.dataLength(type, val);
          writer.writeVal(type, length);
      }
    }
  }
}
