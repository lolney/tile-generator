import { LatLngBounds } from "react-leaflet";

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

export type State = Options & {
  bounds: LatLngBounds;
};
