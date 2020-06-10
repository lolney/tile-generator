import {
  DOWNLOADING,
  FINISHED_MAP,
  RECEIVE_LAYER,
  RECEIVE_LINES,
  RESET_MAP,
  SUBMITTING,
  RECEIVE_ERRORS,
  CLEAR_ERROR,
  RECEIVE_DOWNLOAD_URL,
  RECEIVE_GRID,
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
    case RECEIVE_ERRORS:
      return {
        ...state,
        errorCodes: [...state.errorCodes, ...payload],
      };
    case CLEAR_ERROR:
      return {
        ...state,
        errorCodes: state.errorCodes.filter((elem) => elem !== payload),
      };
    case SUBMITTING:
      return {
        ...initialState,
        ...payload,
        submissionStatus: SubmissionStatus.submitting,
      };
    case FINISHED_MAP:
      return {
        ...state,
        ...payload,
        submissionStatus: SubmissionStatus.done,
      };
    case RECEIVE_DOWNLOAD_URL:
      return {
        ...state,
        downloadUrl: payload,
      };
    case DOWNLOADING:
      return {
        ...state,
        downloaded: true,
      };
    case RESET_MAP:
      return initialState;
    default:
      return { ...state, ...payload };
  }
};

const initialState: MapData = {
  errorCodes: [],
  grid: [],
  layers: {},
  loadingLayer: {
    index: 0,
  },
  downloaded: false,
  riverLines: [],
  submissionStatus: SubmissionStatus.none,
};
