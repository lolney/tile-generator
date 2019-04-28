import { Tile, MapConfigurable } from "../../common/types";
import Map from "./Map";

type HeaderConstant = {
  version: number;
  settings: number;
  terrainTypes: Array<string>;
  featureTypes: Array<string>;
  naturalWonderTypes: Array<string>;
  resourceTypes: Array<string>;
};

export type CivVMapHeader = HeaderConstant &
  MapConfigurable & {
    mapsize: string;
  };

export type SettingsByteConfig = {
  worldWrap: boolean;
  randResources: boolean;
  randGoodies: boolean;
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

const getSettingsByte = (config: SettingsByteConfig) => {
  let bitmask = 0x0;
  if (config.worldWrap) bitmask |= 0x1;
  if (config.randResources) bitmask |= 0x2;
  if (config.randGoodies) bitmask |= 0x4;
  return bitmask;
};

const CIV_CONSTANT_HEADER: HeaderConstant = {
  version: 0x8c,
  settings: getSettingsByte({
    randGoodies: true,
    randResources: true,
    worldWrap: false
  }),
  terrainTypes: Object.keys(terrainTypes),
  featureTypes: Object.keys(featureTypes),
  naturalWonderTypes: [],
  resourceTypes: []
};

export default class CivVMap extends Map {
  header: CivVMapHeader;

  constructor(tiles: number | Array<Tile> = [], params: MapConfigurable) {
    super(tiles, params);
    this.header = {
      ...CIV_CONSTANT_HEADER,
      mapsize: "WORLDSIZE_STANDARD",
      ...params
    };
  }
}
