import { LatLngBounds } from "react-leaflet";
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

export type MapOptions = Options & {
  bounds: LatLngBounds;
};

// --- Tile types --- //

export interface Tile {
  terrain?: TerrainType;
  elevation?: Elevation;
  feature?: FeatureType;
  river?: RiverType;
}

type RiverType = {
  northEast?: boolean;
  northWest?: boolean;
  east?: boolean;
  west?: boolean;
  southEast?: boolean;
  southWest?: boolean;
};

export enum TerrainType {
  grassland,
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
  hill,
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

const LatLngBoundsT = t.type({
  _southWest: t.type({ lat: t.number, lng: t.number }),
  _northEast: t.type({ lat: t.number, lng: t.number })
});

export const MapOptionsT = t.type({
  dimensions: DimensionsT,
  format: GameStringT,
  bounds: LatLngBoundsT
});
