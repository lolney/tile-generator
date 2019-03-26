import MapWriter, { MapDataType, TILE_SIZE } from "./MapWriter";
import { Tile, TerrainType, FeatureType } from "../../common/types";
import CivVMap, { terrainTypes, featureTypes, CivVMapHeader } from "./CivVMap";

type HeaderFormat = [MapDataType, keyof CivVMapHeader];

const headerFormat: Array<HeaderFormat> = [
  ["byte", "version"],
  ["int", "height"],
  ["int", "width"],
  ["byte", "nPlayers"],
  ["int", "wrap"],
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
  ["string", "mapsize"]
];

export default class CivVMapWriter extends MapWriter {
  private map: CivVMap;

  constructor(map: CivVMap) {
    const size = CivVMapWriter.calcMapLength(map);
    super(size);

    this.map = map;
  }

  static calcMapLength(map: CivVMap) {
    let length = TILE_SIZE * map.tiles.length;
    for (const [type, field] of headerFormat) {
      const val = map.header[field];
      length += MapWriter.dataLength(type, val);
    }
    return length;
  }

  write() {
    super.write();
    this.writeHeader();

    for (const tile of this.map.tiles) {
      this.writeTile(tile);
    }

    return this.buffer;
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

  protected writeTile(tile: Tile) {
    // terrain
    this.writeByte(this.getTerrainId(tile.terrain));
    // resource
    this.writeByte(0xff);
    // feature
    this.writeByte(this.getFeatureId(tile.feature));
    // river
    this.writeByte(0x0);
    // elevation
    this.writeByte(tile.elevation ? tile.elevation : 0x0);
    // continent
    this.writeByte(0x0);
    // natural wonder
    this.writeByte(0xff);
    // unknown
    this.writeByte(0x0);
  }

  private writeHeader() {
    for (const [type, field] of headerFormat) {
      const val = this.map.header[field];

      switch (type) {
        case "byte":
        case "int":
        case "stringList":
        case "string":
        case "tile":
          this.writeVal(type, val);
          break;
        case "length(int)":
        case "int0":
          const length = MapWriter.dataLength(type, val);
          this.writeVal(type, length);
      }
    }
  }
}
