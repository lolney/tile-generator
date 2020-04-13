import * as t from "io-ts";

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
  marsh
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

export enum TerrainType {
  grass,
  plains,
  tundra,
  desert,
  ice,
  coast,
  ocean
}

export enum FeatureType {
  ice,
  marsh,
  forest,
  jungle,
  oasis,
  floodplains,
  atoll,
  fallout
}

export enum Elevation {
  flat,
  hills,
  mountain
}

// --- Koppen climate --- //

export enum Koppen {
  Af,
  Am,
  Aw,
  As,
  BWh,
  BWk,
  BSh,
  BSk,
  Cfa,
  Cfb,
  Cfc,
  Cwa,
  Cwb,
  Cwc,
  Csa,
  Csb,
  Csc,
  Dfa,
  Dfb,
  Dfc,
  Dfd,
  Dwa,
  Dwb,
  Dwd,
  Dwc,
  Dsa,
  Dsb,
  Dsc,
  Dsd,
  ET,
  EF,
  Ocean
}

// -------  io-ts dynamic types -------- //

const GameStringT = t.keyof({
  "Civ V": null,
  "Civ VI": null
});

const DimensionsT = t.type({ width: t.number, height: t.number });

export const LatLngBoundsT = t.type({
  _southWest: t.type({ lat: t.number, lng: t.number }),
  _northEast: t.type({ lat: t.number, lng: t.number })
});

export const MapOptionsT = t.type({
  dimensions: DimensionsT,
  format: GameStringT,
  bounds: LatLngBoundsT
});
