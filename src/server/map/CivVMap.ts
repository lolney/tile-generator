import { Tile } from "../../common/types";
import Map from "./Map";

type HeaderConfigurable = {
  width: number;
  height: number;
  nPlayers: number;
  name: string;
  description: string;
};

type HeaderConstant = {
  version: number;
  wrap: number;
  terrainTypes: Array<string>;
  featureTypes: Array<string>;
  naturalWonderTypes: Array<string>;
  resourceTypes: Array<string>;
};

export type CivVMapHeader = HeaderConstant &
  HeaderConfigurable & {
    mapsize: string;
  };

export const terrainTypes = {
  TERRAIN_GRASS: 0,
  TERRAIN_PLAINS: 1,
  TERRAIN_DESERT: 2,
  TERRAIN_TUNDRA: 3,
  TERRAIN_SNOW: 4,
  TERRAIN_COAST: 5,
  TERRAIN_OCEAN: 6
};

export const featureTypes = {
  FEATURE_ICE: 0,
  FEATURE_JUNGLE: 1,
  FEATURE_MARSH: 2,
  FEATURE_OASIS: 3,
  FEATURE_FLOOD_PLAINS: 4,
  FEATURE_FOREST: 5,
  FEATURE_FALLOUT: 6,
  FEATURE_ATOLL: 7
};

const CIV_CONSTANT_HEADER: HeaderConstant = {
  version: 0x8c,
  wrap: 0,
  terrainTypes: Object.keys(terrainTypes),
  featureTypes: Object.keys(featureTypes),
  naturalWonderTypes: [],
  resourceTypes: []
};

export default class CivVMap extends Map {
  header: CivVMapHeader;

  constructor(tiles: number | Array<Tile> = [], params: HeaderConfigurable) {
    super(tiles);
    this.header = {
      ...CIV_CONSTANT_HEADER,
      mapsize: "WORLDSIZE_STANDARD",
      ...params
    };
  }
}
