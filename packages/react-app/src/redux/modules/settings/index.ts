import { LatLngBounds } from "leaflet";
import {
  layerWeightDefaults,
  MapOptions,
  Options,
} from "@tile-generator/common";

type Action = ReturnType<typeof changeOptions>;

const initialState: MapOptions = {
  dimensions: { width: 20, height: 20 },
  format: "Civ VI",
  layerWeights: layerWeightDefaults,
  bounds: {
    _southWest: { lat: 37, lng: -121 },
    _northEast: { lat: 38, lng: -120 },
  },
};

const CHANGE_BOUNDS = "CHANGE_BOUNDS";
const CHANGE_OPTIONS = "CHANGE_OPTIONS";

export const changeOptions = (options: Partial<Options>) => ({
  type: CHANGE_OPTIONS,
  payload: { ...options },
});

export const resetOptions = () => ({
  type: CHANGE_OPTIONS,
  payload: {
    format: initialState.format,
    dimensions: initialState.dimensions,
    layerWeights: layerWeightDefaults,
  },
});

export const changeBounds = (bounds: LatLngBounds) => ({
  type: CHANGE_BOUNDS,
  payload: { bounds },
});

export const settings = (state = initialState, { type, payload }: Action) => {
  switch (type) {
    case CHANGE_OPTIONS:
    case CHANGE_BOUNDS:
      return { ...state, ...payload };
    default:
      return state;
  }
};
