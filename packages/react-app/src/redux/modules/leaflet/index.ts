import { LeafletState } from "../../types";
import { SELECT_LAYER } from "./actionTypes";
import { SUBMITTING, RECEIVE_LAYER } from "../map/actions";
import { receiveLayerAction, submitting } from "../map";
import { MapLayerValue } from "@tile-generator/common";
import { combineReducers } from "redux";

const initialState: LeafletState = {
  selectedLayer: null,
  startPosition: {
    center: [37.5, -120.5],
    zoom: 8,
  },
};

type Action =
  | ReturnType<typeof selectLayer>
  | ReturnType<typeof receiveLayerAction>
  | ReturnType<typeof submitting>;

export const selectLayer = (layerName: MapLayerValue) => ({
  type: SELECT_LAYER as typeof SELECT_LAYER,
  payload: { layerName },
});

export const selectedLayer = (
  state = initialState.selectedLayer,
  action: Action
) => {
  switch (action.type) {
    case SUBMITTING:
      return null;
    case SELECT_LAYER:
      return action.payload.layerName;
    case RECEIVE_LAYER:
      // If receiving a layer for the first time, set this one to selected
      if (state === null) {
        return Object.keys(action.payload.layer)[0] as MapLayerValue;
      }
      return state;
    default:
      return state;
  }
};

export const startPosition = (
  state = initialState.startPosition,
  action: Action
) => {
  switch (action.type) {
    case SUBMITTING:
      return action.payload.savedStartPosition;
    default:
      return state;
  }
};

export const leaflet = combineReducers({
  selectedLayer,
  startPosition,
});
