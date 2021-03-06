import { SubmissionStatus, StartPosition } from "../../types";
import { LayersType, errorCodes } from "@tile-generator/common";
import { LineString } from "geojson";

export const CLEAR_ERROR = "CLEAR_ERROR";
export const DOWNLOADING = "DOWNLOADING";
export const FINISHED_MAP = "FINISHED_MAP";
export const RECEIVE_DOWNLOAD_URL = "RECEIVE_DOWNLOAD_URL";
export const RECEIVE_ERRORS = "RECEIVE_ERRORS";
export const RECEIVE_GRID = "RECEIVE_GRID";
export const RECEIVE_LAYER = "RECEIVE_LAYER";
export const RECEIVE_LINES = "RECEIVE_LINES";
export const RESET_MAP = "RESET_MAP";
export const SUBMITTING = "SUBMITTING";

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

export const clearError = (key: keyof typeof errorCodes) => ({
  type: CLEAR_ERROR,
  payload: key,
});

export const receiveGrid = (payload: any) => ({
  type: RECEIVE_GRID,
  payload,
});

export const resetMap = () => ({
  type: RESET_MAP,
});

export const downloading = () => ({
  type: DOWNLOADING as typeof DOWNLOADING,
});

export const submitting = (savedStartPosition: StartPosition) => ({
  type: SUBMITTING as typeof SUBMITTING,
  payload: {
    errorMessage: undefined,
    requestId: `${Math.random()}`,
    submissionStatus: SubmissionStatus.submitting,
    savedStartPosition,
  },
});

export const receiveLayerAction = (data: { layer: LayersType }) => ({
  payload: { layer: data.layer },
  type: RECEIVE_LAYER as typeof RECEIVE_LAYER,
});

export const receiveErrors = (codes: Array<keyof typeof errorCodes>) => ({
  payload: codes,
  type: RECEIVE_ERRORS,
});

export const receiveDownloadUrl = (url: string) => ({
  payload: url,
  type: RECEIVE_DOWNLOAD_URL,
});

export const receiveRiverLines = (lines: LineString[]) => ({
  payload: lines,
  type: RECEIVE_LINES,
});
