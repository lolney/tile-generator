import {
  DOWNLOADING,
  FINISHED_MAP,
  RECEIVE_LAYER,
  RECEIVE_LINES,
  RESET_MAP,
  SUBMITTING,
} from "./actions";
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
        loadingLayer: { index: state.loadingLayer.index + 1 },
      };
    case RECEIVE_LINES:
      return {
        ...state,
        riverLines: payload,
      };
    case SUBMITTING:
      return {
        ...initialState,
        ...payload,
        submissionStatus: SubmissionStatus.submitting,
      };
    case FINISHED_MAP:
      if (state.removeSSEListener) state.removeSSEListener();
      return {
        ...state,
        ...payload,
        submissionStatus: SubmissionStatus.done,
        removeSSEListener: undefined,
      };
    case DOWNLOADING:
      return {
        ...state,
        downloaded: true,
      };
    case RESET_MAP:
      if (state.removeSSEListener) state.removeSSEListener();
      return initialState;
    default:
      return { ...state, ...payload };
  }
};

const initialState: MapData = {
  grid: [],
  layers: {},
  loadingLayer: {
    index: 0,
  },
  downloaded: false,
  riverLines: [],
  submissionStatus: SubmissionStatus.none,
};
