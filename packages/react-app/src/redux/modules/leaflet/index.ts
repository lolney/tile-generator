import { LeafletState } from "../../types";
import { SELECT_LAYER } from "./actionTypes";
import { SUBMITTING, RECEIVE_LAYER } from "../map/actions";
import { receiveLayerAction, submitting } from "../map";
import { MapLayerValue } from "@tile-generator/common";

const initialState: LeafletState = {
  selectedLayer: undefined,
};

type Action =
  | ReturnType<typeof selectLayer>
  | ReturnType<typeof receiveLayerAction>
  | ReturnType<typeof submitting>;

export const selectLayer = (layerName: MapLayerValue) => ({
  type: SELECT_LAYER as typeof SELECT_LAYER,
  payload: { layerName },
});

export const leaflet = (state = initialState, action: Action) => {
  switch (action.type) {
    case SUBMITTING:
      return { ...state, selectedLayer: undefined };
    case SELECT_LAYER:
      return { selectedLayer: action.payload.layerName };
    case RECEIVE_LAYER:
      // If receiving a layer for the first time, set this one to selected
      if (state.selectedLayer === undefined) {
        return {
          ...state,
          selectedLayer: Object.keys(action.payload.layer)[0] as MapLayerValue,
        };
      }
    default:
      return state;
  }
};