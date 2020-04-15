import { State } from "../../types";

export const isLastLayer = (state: State) =>
  state.mapData.totalLayers !== undefined &&
  state.mapData.totalLayers === state.mapData.loadingLayer.index;

export const selectMapId = (state: State) => state.mapData.mapId;
export const selectOptions = (state: State) => state.settings;
