import TileMap from "./Map";
import {
  Tile,
  TerrainType,
  Elevation,
  FeatureType,
  MapConfigurable
} from "../../common/types";
import { Map as DBMap, Players, PlotRivers } from "./Civ6Map.types";
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

export default class Civ6Map extends TileMap {
  attributes: MapAttributes;
  metadata: MetaData;
  map: DBMap;
  players: Players[];
  private _orderedTiles?: Tile[];

  constructor(tiles: number | Array<Tile>, configurable: MapConfigurable) {
    super(tiles, configurable);

    const { name, width, height } = configurable;

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

  getFeatures = () =>
    this.orderedTiles.map(tile => Civ6Map.getFeatureType(tile));

  get orderedTiles() {
    if (this._orderedTiles) return this._orderedTiles;

    const tiles = [...this.tiles];
    let bottomRow = this.map.Height - 1;
    let topRow = 0;

    for (; topRow < bottomRow; ) {
      for (let col = 0; col < this.map.Width; col++) {
        const topIndex = this.getIndex(topRow, col)!;
        const bottomIndex = this.getIndex(bottomRow, col)!;
        const top = tiles[topIndex];
        tiles[topIndex] = tiles[bottomIndex];
        tiles[bottomIndex] = top;
      }
      topRow++;
      bottomRow--;
    }

    return (this._orderedTiles = tiles);
  }

  getRiverType(plot: Tile, index: number) {
    const riverType = plot.river;

    const plotRivers: PlotRivers = {
      ID: index,
      IsNEOfRiver: false,
      IsWOfRiver: false,
      IsNWOfRiver: false,
      EFlowDirection: -1,
      SWFlowDirection: -1,
      SEFlowDirection: -1
    };

    if (!riverType) return plotRivers;

    if (riverType.east) {
      plotRivers.IsWOfRiver = true;
    }
    if (riverType.southWest) {
      plotRivers.IsNEOfRiver = true;
    }
    if (riverType.southEast) {
      plotRivers.IsNWOfRiver = true;
    }

    return plotRivers;
  }

  getRivers(): PlotRivers[] {
    this.remapRivers();
    const plotRivers = this.orderedTiles.map((tile, i) =>
      this.getRiverType(tile, i)
    );

    return plotRivers;
  }
}
