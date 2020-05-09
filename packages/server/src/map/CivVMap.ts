import { Tile, MapConfigurable } from "@tile-generator/common";
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
  TERRAIN_OCEAN: 6,
};

export const featureTypes = {
  FEATURE_ICE: 0,
  FEATURE_JUNGLE: 1,
  FEATURE_MARSH: 2,
  FEATURE_OASIS: 3,
  FEATURE_FLOOD_PLAINS: 4,
  FEATURE_FOREST: 5,
  FEATURE_FALLOUT: 6,
  FEATURE_ATOLL: 7,
};

export const naturalWonderTypes = {
  FEATURE_CRATER: 0,
  FEATURE_FUJI: 1,
  FEATURE_MESA: 2,
  FEATURE_REEF: 3,
  FEATURE_VOLCANO: 4,
  FEATURE_GIBRALTAR: 5,
  FEATURE_GEYSER: 6,
  FEATURE_FOUNTAIN_YOUTH: 7,
  FEATURE_POTOSI: 8,
  FEATURE_EL_DORADO: 9,
  FEATURE_SRI_PADA: 10,
  FEATURE_MT_SINAI: 11,
  FEATURE_MT_KAILASH: 12,
  FEATURE_ULURU: 13,
  FEATURE_LAKE_VICTORIA: 14,
  FEATURE_KILIMANJARO: 15,
  FEATURE_SOLOMONS_MINES: 16,
};

export const resourceTypes = {
  RESOURCE_IRON: 0,
  RESOURCE_HORSE: 1,
  RESOURCE_COAL: 2,
  RESOURCE_OIL: 3,
  RESOURCE_ALUMINUM: 4,
  RESOURCE_URANIUM: 5,
  RESOURCE_WHEAT: 6,
  RESOURCE_COW: 7,
  RESOURCE_SHEEP: 8,
  RESOURCE_DEER: 9,
  RESOURCE_BANANA: 10,
  RESOURCE_FISH: 11,
  RESOURCE_STONE: 12,
  RESOURCE_WHALE: 13,
  RESOURCE_PEARLS: 14,
  RESOURCE_GOLD: 15,
  RESOURCE_SILVER: 16,
  RESOURCE_GEMS: 17,
  RESOURCE_MARBLE: 18,
  RESOURCE_IVORY: 19,
  RESOURCE_FUR: 20,
  RESOURCE_DYE: 21,
  RESOURCE_SPICES: 22,
  RESOURCE_SILK: 23,
  RESOURCE_SUGAR: 24,
  RESOURCE_COTTON: 25,
  RESOURCE_WINE: 26,
  RESOURCE_INCENSE: 27,
  RESOURCE_JEWELRY: 28,
  RESOURCE_PORCELAIN: 29,
  RESOURCE_COPPER: 30,
  RESOURCE_SALT: 31,
  RESOURCE_CRAB: 32,
  RESOURCE_TRUFFLES: 33,
  RESOURCE_CITRUS: 34,
  RESOURCE_ARTIFACTS: 35,
  RESOURCE_NUTMEG: 36,
  RESOURCE_CLOVES: 37,
  RESOURCE_PEPPER: 38,
  RESOURCE_HIDDEN_ARTIFACT: 39,
};

const getSettingsByte = (config: SettingsByteConfig) => {
  let bitmask = 0x0;
  if (config.worldWrap) bitmask |= 0x1;
  if (config.randResources) bitmask |= 0x2;
  if (config.randGoodies) bitmask |= 0x4;
  return bitmask;
};

const CIV_CONSTANT_HEADER: HeaderConstant = {
  version: 0x0b,
  settings: getSettingsByte({
    randGoodies: true,
    randResources: true,
    worldWrap: false,
  }),
  terrainTypes: Object.keys(terrainTypes),
  featureTypes: Object.keys(featureTypes),
  naturalWonderTypes: Object.keys(naturalWonderTypes),
  resourceTypes: Object.keys(resourceTypes),
};

export default class CivVMap extends Map {
  header: CivVMapHeader;

  constructor(tiles: number | Array<Tile> = [], params: MapConfigurable) {
    super(tiles, params);
    this.header = {
      ...CIV_CONSTANT_HEADER,
      mapsize: "WORLDSIZE_STANDARD",
      ...params,
    };
  }

  get filename() {
    return `${this.header.name}.Civ5Map`;
  }
}
