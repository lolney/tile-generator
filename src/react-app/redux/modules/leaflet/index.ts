import { LeafletState } from "../../types";
import { SELECT_LAYER } from "./actionTypes";
import { SUBMITTING, RECEIVE_LAYER } from "../map/actionTypes";

const initialState: LeafletState = {
  selectedLayer: undefined
};

type Action = ReturnType<typeof selectLayer>;

// Selector for received layers

// Actions:
// - Select layer
// - Change bounds

// Selectors:
// - calc available layers
// - calc layer based on layer state
// - calc preview layer based on bounds

/*
Could include these in state, but are derived, 
so probably better implemented as selector
Exception would be if preview layer is changed
to be more integral to the area select.

  layer: any;
  previewLayer: any;
*/

const selectLayer = (layerName: string) => ({
  type: SELECT_LAYER,
  payload: { layerName }
});

export const leaflet = (state = initialState, { payload, type }: Action) => {
  switch (type) {
    case SUBMITTING:
      return { ...state, selectedLayer: undefined };
    case RECEIVE_LAYER:
      // If receiving a layer for the first time, set this one to selected
      if (state.selectedLayer === undefined) {
        return { ...state, selectedLayer: payload.layerName };
      }
    default:
      return { ...state, ...payload };
  }
};
