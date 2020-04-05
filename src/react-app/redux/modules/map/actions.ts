import { State, SubmissionStatus, MapData } from "../../types";
import { LayersType } from "../../../../common/types";

export const SUBMITTING = "SUBMITTING";
export const RECEIVE_LAYER = "RECEIVE_LAYER";
export const RECEIVE_GRID = "RECEIVE_GRID";
export const FINISHED_MAP = "FINISHED_MAP";
export const CLEAR_ERROR = "CLEAR_ERROR";

export const finishedMap = () => ({
  type: FINISHED_MAP,
  payload: {
    loadingLayer: {
      index: 0,
      name: undefined
    },
    submissionStatus: SubmissionStatus.done
  }
});

export const submitError = (errorMessage: string) => ({
  type: FINISHED_MAP,
  payload: {
    loadingLayer: {
      index: 0,
      name: undefined
    },
    errorMessage,
    submissionStatus: SubmissionStatus.errored
  }
});

export const clearError = () => ({
  type: CLEAR_ERROR,
  payload: { errorMessage: undefined, submissionStatus: SubmissionStatus.none }
});

export const receiveGrid = (payload: any) => ({
  type: RECEIVE_GRID,
  payload
});

export const submitting = () => ({
  type: SUBMITTING as typeof SUBMITTING,
  payload: {
    errorMessage: undefined,
    submissionStatus: SubmissionStatus.errored
  }
});

export const receiveLayerAction = (data: { layer: LayersType }) => ({
  payload: { layer: data.layer },
  type: RECEIVE_LAYER as typeof RECEIVE_LAYER
});
