import { SubmissionStatus } from "../../types";
import { LayersType } from "../../../../common/types";
import { LineString } from "geojson";

export const SUBMITTING = "SUBMITTING";
export const RECEIVE_LAYER = "RECEIVE_LAYER";
export const RECEIVE_GRID = "RECEIVE_GRID";
export const FINISHED_MAP = "FINISHED_MAP";
export const CLEAR_ERROR = "CLEAR_ERROR";
export const RECEIVE_LINES = "RECEIVE_LINES";
export const RESET_MAP = "RESET_MAP";

export const finishedMap = () => ({
  type: FINISHED_MAP,
  payload: {
    loadingLayer: {
      index: 0,
      name: undefined,
    },
    submissionStatus: SubmissionStatus.done,
  },
});

export const submitError = (errorMessage: string) => ({
  type: FINISHED_MAP,
  payload: {
    loadingLayer: {
      index: 0,
      name: undefined,
    },
    errorMessage,
    submissionStatus: SubmissionStatus.errored,
  },
});

export const clearError = () => ({
  type: CLEAR_ERROR,
  payload: { errorMessage: undefined, submissionStatus: SubmissionStatus.none },
});

export const receiveGrid = (payload: any) => ({
  type: RECEIVE_GRID,
  payload,
});

export const resetMap = () => ({
  type: resetMap,
});

export const submitting = () => ({
  type: SUBMITTING as typeof SUBMITTING,
  payload: {
    errorMessage: undefined,
    submissionStatus: SubmissionStatus.submitting,
  },
});

export const receiveLayerAction = (data: { layer: LayersType }) => ({
  payload: { layer: data.layer },
  type: RECEIVE_LAYER as typeof RECEIVE_LAYER,
});

export const receiveRiverLines = (lines: LineString[]) => ({
  payload: lines,
  type: RECEIVE_LINES,
});
