import Map from "./Map";
import {
  Tile,
  TerrainType,
  Elevation,
  FeatureType,
  MapConfigurable
} from "../../common/types";
import { Map as DBMap, Players } from "./Civ6Map.types.";
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

export default class Civ6Map extends Map {
  attributes: MapAttributes;
  metadata: MetaData;
  map: DBMap;
  players: Players[];

  constructor(
    tiles: number | Array<Tile>,
    { name, width, height, nPlayers }: MapConfigurable
  ) {
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
      MapSizeType: "MAPSIZE_DUEL"
    };

    this.attributes = {
      MapScript: "Continents.lua",
      Ruleset: "RULESET_STANDARD"
    };

    const colors = [
      "PLAYERCOLOR_LIGHT_ORANGE",
      "PLAYERCOLOR_GREEN_AND_WHITE",
      "PLAYERCOLOR_DARK_INDIGO",
      "PLAYERCOLOR_ORANGE",
      "PLAYERCOLOR_CYAN_AND_GRAY",
      "PLAYERCOLOR_RED_AND_GOLD",
      "PLAYERCOLOR_LIGHT_GREEN",
      "PLAYERCOLOR_ORANGE_AND_GREEN"
    ];

    this.players = colors.map((color, i) =>
      Civ6Map.createCivilization(i, color)
    );

    this.players[0].Status = "Human";

    const barbs = Civ6Map.createCivilization(63, "CIVILIZATION_BARBARIAN");
    this.players.push({
      ...barbs,
      Initialized: true,
      CivilizationType: "CIVILIZATION_BARBARIAN",
      CivilizationLevelType: "CIVILIZATION_LEVEL_TRIBE"
    });
  }

  static createCivilization(ID: number, color: string): Players {
    return {
      ID,
      CivilizationType: "UNDEFINED",
      LeaderType: "UNDEFINED",
      CivilizationLevelType: "CIVILIZATION_LEVEL_FULL_CIV",
      AgendaType: "",
      Status: "AI",
      Handicap: "DIFFICULTY_PRINCE",
      StartingPosition: "INVALID",
      Color: color,
      Initialized: false
    };
  }

  static getTerrainType(tile: Tile) {
    const { elevation, terrain } = tile;

    if (!terrain) return "TERRAIN_GRASS";

    const terrainS: string = TerrainType[terrain];
    if (elevation === undefined || elevation === Elevation.flat)
      return `TERRAIN_${terrainS.toUpperCase()}`;

    const elevationS: string = Elevation[elevation];
    return `TERRAIN_${terrainS.toUpperCase()}_${elevationS.toUpperCase()}`;
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
