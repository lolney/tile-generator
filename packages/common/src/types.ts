export interface Dimensions {
  width: number;
  height: number;
}

export type GameString = "Civ V" | "Civ VI";

export const gameStrings: Array<GameString> = ["Civ V", "Civ VI"];

export interface Options {
  dimensions: Dimensions;
  format: GameString;
}

export type LatLngBounds = {
  _southWest: { lat: number; lng: number };
  _northEast: { lat: number; lng: number };
};

export type MapOptions = Options & {
  bounds: LatLngBounds;
};

export enum MapLayers {
  climate,
  elevation,
  forest,
  rivers,
  marsh,
}

export type MapLayerValue =
  | "climate"
  | "forest"
  | "elevation"
  | "rivers"
  | "marsh";

export type LayersType = { [P in MapLayerValue]?: Array<Tile> };

// --- Server ----- //

export type MapConfigurable = {
  width: number;
  height: number;
  nPlayers: number;
  name: string;
  description: string;
};

// --- Tile types --- //

export interface Tile {
  terrain?: TerrainType;
  elevation?: Elevation;
  feature?: FeatureType;
  river?: RiverType;
}

export type RiverType = {
  northEast?: boolean;
  northWest?: boolean;
  east?: boolean;
  west?: boolean;
  southEast?: boolean;
  southWest?: boolean;
};

export type RiverFlow = {
  northEast?: boolean; // north
  northWest?: boolean; // north
  east?: boolean; // south
  west?: boolean; // south
  southEast?: boolean; // north
  southWest?: boolean; // north
};

export enum TerrainType {
  grass = 0,
  plains = 1,
  desert = 2,
  tundra = 3,
  ice = 4,
  coast = 5,
  ocean = 6,
}

export enum FeatureType {
  ice = 0,
  jungle = 1,
  marsh = 2,
  oasis = 3,
  floodplains = 4,
  forest = 5,
  atoll = 6,
  fallout = 7,
}

export enum Elevation {
  flat,
  hills,
  mountain,
}

// --- Koppen climate --- //

export enum Koppen {
  Ocean = 0,
  Af = 1,
  Am = 2,
  Aw = 3,
  BWh = 4,
  BWk = 5,
  BSh = 6,
  BSk = 7,
  Csa = 8,
  Csb = 9,
  Csc = 10,
  Cwa = 11,
  Cwb = 12,
  Cwc = 13,
  Cfa = 14,
  Cfb = 15,
  Cfc = 16,
  Dsa = 17,
  Dsb = 18,
  Dsc = 19,
  Dwa = 20,
  Dwb = 21,
  Dwd = 22,
  Dwc = 23,
  Dsd = 24,
  Dfa = 25,
  Dfb = 26,
  Dfc = 27,
  Dfd = 28,
  ET = 29,
  EF = 30,
}
