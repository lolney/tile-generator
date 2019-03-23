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
