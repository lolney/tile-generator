import Map from "./Map";
import { Tile, TerrainType, Elevation, FeatureType } from "../../common/types";
import { Map as DBMap } from "./Civ6Map.types.";
import uuid from "uuid/v4";

type MetaData = {
  MetaDataVersion: number;
  AppVersion: string;
  DisplayName: string;
  ID: string;
  IsMod: boolean;
};

type MapAttributes = {
  MapScript: string;
  Ruleset: string;
};

type Params = {
  name: string;
  width: number;
  height: number;
};
// MetaData, MapAttributes, Map
export default class Civ6Map extends Map {
  attributes: MapAttributes;
  metadata: MetaData;
  map: DBMap;

  constructor(tiles: number | Array<Tile>, { name, width, height }: Params) {
    super(tiles);

    this.metadata = {
      ID: uuid(),
      MetaDataVersion: 1,
      AppVersion: "1.0.0.0 (0)",
      IsMod: false,
      DisplayName: name
    };

    this.map = {
      ID: "Default",
      Width: width,
      Height: height,
      WrapX: false,
      WrapY: false,
      TopLatitude: 90,
      BottomLatitude: -90,
      MapSizeType: "MAPSIZE_STANDARD"
    };

    this.attributes = {
      MapScript: "Continents.lua",
      Ruleset: "RULESET_STANDARD"
    };
  }

  static getTerrainType(tile: Tile) {
    const { elevation, terrain } = tile;

    if (!terrain) return "TERRAIN_GRASS";
    else if (!elevation) {
      const terrainS: string = TerrainType[terrain];
      return `TERRAIN_${terrainS.toUpperCase()}`;
    } else {
      const terrainS: string = TerrainType[terrain];
      const elevationS: string = Elevation[elevation];
      return `TERRAIN_${terrainS.toUpperCase()}_${terrainS.toUpperCase()}`;
    }
  }

  static getFeatureType(tile: Tile) {
    const { feature } = tile;

    if (!feature) return null;
    else {
      const featureS: string = FeatureType[feature];
      return `FEATURE_${featureS.toUpperCase()}`;
    }
  }
}
