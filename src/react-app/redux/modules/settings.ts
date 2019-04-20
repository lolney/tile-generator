import { LatLngBounds, LatLng } from "leaflet";
import { MapOptions, Options } from "../../../common/types";

type Action = ReturnType<typeof changeOptions>;

const initialState: MapOptions = {
  dimensions: { width: 10, height: 10 },
  format: "Civ V",
  bounds: new LatLngBounds(new LatLng(37, -121), new LatLng(38, -120))
};

const CHANGE_OPTIONS = "CHANGE_OPTIONS";
const CHANGE_BOUNDS = "CHANGE_BOUNDS";

export const changeOptions = (options: Options) => ({
  type: CHANGE_OPTIONS,
  payload: { ...options }
});

export const changeBounds = (bounds: LatLngBounds) => ({
  type: CHANGE_BOUNDS,
  payload: { bounds }
});

export const settings = (state = initialState, { type, payload }: Action) => {
  switch (type) {
    default:
      return { ...state, ...payload };
  }
};
