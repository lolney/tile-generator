import TileMap from "./Map";
import {
  Tile,
  TerrainType,
  Elevation,
  FeatureType,
  MapConfigurable,
} from "@tile-generator/common";
import { Map as DBMap, Players, PlotRivers } from "./Civ6Map.types";
import uuid from "uuid/v4";
import findStartPositions from "./Civ6StartPositions/findStartPositions";
import { TilesArray } from "@tile-generator/common";

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
  modText: { Language: string; ID: string; Value: string }[];
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
      DisplayName: name,
    };

    this.modText = [
      {
        Language: "en_US",
        ID: "LOC_8F7F939961B09C489D47069F2C6329D5_MOD_TITLE",
        Value: "TileBuilder Map Mod",
      },
      {
        Language: "en_US",
        ID: "LOC_8F7F939961B09C489D47069F2C6329D5_MOD_DESCRIPTION",
        Value: "A Map Mod generated by TileBuilder",
      },
      {
        Language: "en_US",
        ID: "LOC_8F7F939961B09C489D47069F2C6329D5_MAP_NAME",
        Value: "TileBuilder Map",
      },
      {
        Language: "en_US",
        ID: "LOC_8F7F939961B09C489D47069F2C6329D5_MAP_DESCRIPTION",
        Value: "A  map generated by TileBuilder",
      },
    ];

    this.map = {
      ID: "Default",
      Width: width,
      Height: height,
      WrapX: false,
      WrapY: false,
      TopLatitude: 90,
      BottomLatitude: -90,
      MapSizeType: Civ6Map.getMapSize(this.tiles.length),
    };

    this.attributes = {
      MapScript: "Continents.lua",
      Ruleset: "RULESET_STANDARD",
    };

    const colors = [
      "PLAYERCOLOR_LIGHT_ORANGE",
      "PLAYERCOLOR_GREEN_AND_WHITE",
      "PLAYERCOLOR_DARK_INDIGO",
      "PLAYERCOLOR_ORANGE",
      "PLAYERCOLOR_CYAN_AND_GRAY",
      "PLAYERCOLOR_RED_AND_GOLD",
      "PLAYERCOLOR_LIGHT_GREEN",
      "PLAYERCOLOR_ORANGE_AND_GREEN",
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
      CivilizationLevelType: "CIVILIZATION_LEVEL_TRIBE",
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
      Initialized: false,
    };
  }

  static getMapSize = (size: number) => {
    if (size <= 44 * 26) return "MAPSIZE_DUEL";
    if (size <= 60 * 38) return "MAPSIZE_TINY";
    if (size <= 74 * 46) return "MAPSIZE_SMALL";
    if (size <= 84 * 54) return "MAPSIZE_STANDARD";
    if (size <= 96 * 60) return "MAPSIZE_LARGE";
    return "MAPSIZE_HUGE";
  };

  getDefaultCivCount = () => {
    switch (this.map.MapSizeType) {
      case "MAPSIZE_DUEL":
        return { minorCount: 3, majorCount: 2 };
      case "MAPSIZE_TINY":
        return { minorCount: 6, majorCount: 4 };
      case "MAPSIZE_SMALL":
        return { minorCount: 9, majorCount: 6 };
      case "MAPSIZE_STANDARD":
        return { minorCount: 12, majorCount: 8 };
      case "MAPSIZE_LARGE":
        return { minorCount: 15, majorCount: 10 };
      case "MAPSIZE_HUGE":
      default:
        return { minorCount: 18, majorCount: 12 };
    }
  };

  static getTerrainType(tile: Tile) {
    const { elevation, terrain } = tile;

    if (terrain === undefined) return "TERRAIN_GRASS";

    const terrainS: string = TerrainType[terrain];
    if (elevation === undefined || elevation === Elevation.flat)
      return `TERRAIN_${terrainS.toUpperCase()}`;

    const elevationS: string = Elevation[elevation];
    return `TERRAIN_${terrainS.toUpperCase()}_${elevationS.toUpperCase()}`;
  }

  static getFeatureType(tile: Tile) {
    const { feature } = tile;

    if (feature === undefined) return null;
    else {
      const featureS: string = FeatureType[feature];
      return `FEATURE_${featureS.toUpperCase()}`;
    }
  }

  getFeatures = () =>
    this.orderedTiles.map((tile) => Civ6Map.getFeatureType(tile));

  get filename() {
    return `${this.metadata.ID}.Civ6Map`;
  }

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
      SEFlowDirection: -1,
    };

    if (riverType === undefined) return plotRivers;

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

  getStartPositions = () => {
    const { majorCount, minorCount } = this.getDefaultCivCount();
    const tilesArray = new TilesArray(this.orderedTiles, this.map.Width);
    const { majors, minors } = findStartPositions(
      tilesArray,
      minorCount,
      majorCount
    );

    return [
      ...majors.map(({ i, j }) => ({
        Plot: tilesArray.getIndex(i, j),
        Type: "RANDOM_MAJOR",
        Value: "-1",
      })),
      ...minors.map(({ i, j }) => ({
        Plot: tilesArray.getIndex(i, j),
        Type: "RANDOM_MINOR",
        Value: "-1",
      })),
    ];
  };

  getRivers(): PlotRivers[] {
    this.remapRivers();
    const plotRivers = this.orderedTiles.map((tile, i) =>
      this.getRiverType(tile, i)
    );

    return plotRivers;
  }
}
