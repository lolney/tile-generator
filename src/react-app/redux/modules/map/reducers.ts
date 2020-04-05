import { RECEIVE_LAYER, FINISHED_MAP } from "./actions";
import { MapData, SubmissionStatus } from "../../types";
import { Action } from "./types";

export const map = (
  state = initialState,
  { type, payload }: Action
): MapData => {
  switch (type) {
    case RECEIVE_LAYER:
      return {
        ...state,
        layers: { ...state.layers, ...payload.layer },
        loadingLayer: { index: state.loadingLayer.index + 1 }
      };
    case FINISHED_MAP:
      if (state.removeSSEListener) state.removeSSEListener();
    default:
      return { ...state, ...payload };
  }
};

const initialState: MapData = {
  grid: [],
  layers: {},
  loadingLayer: {
    index: 0
  },
  submissionStatus: SubmissionStatus.none
};
