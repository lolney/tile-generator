import { State, SubmissionStatus, MapData } from "../types";
import { MapOptions } from "../../../common/types";
import download from "downloadjs";

type Action =
  | ReturnType<typeof receiveGrid>
  | ReturnType<typeof submitting>
  | ReturnType<typeof finishedMap>
  | ReturnType<typeof submitError>
  | ReturnType<typeof clearError>;

type ThunkAction =
  | ReturnType<typeof submit>
  | ReturnType<typeof receiveLayers>
  | ReturnType<typeof receiveLayer>
  | typeof downloadMap
  | typeof finishedMap
  | typeof submitError
  | typeof clearError;
type Dispatch = (f: ThunkAction | Action) => void;

const SUBMITTING = "SUBMITTING";
const RECEIVE_LAYER = "RECEIVE_LAYERS";
const RECEIVE_GRID = "RECEIVE_GRID";
const FINISHED_MAP = "FINISHED_MAP";
const CLEAR_ERROR = "CLEAR_ERROR";

const submit = (options: MapOptions) => (dispatch: Dispatch) => {
  dispatch(submitting());

  return fetch("/api/map", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(options)
  }).then(
    resp => dispatch(receiveLayers(resp)),
    error => dispatch(submitError(error))
  );
};

const receiveLayers = (resp: Response) => async (dispatch: Dispatch) => {
  const res = await resp.json();

  let eventSource = new EventSource(`updates/${res.id}`);
  const callback = (e: Event) => dispatch(receiveLayer(e));
  eventSource.addEventListener("layer", callback);
  const removeSSEListener = () =>
    eventSource.removeEventListener("layer", callback);

  dispatch(
    receiveGrid({
      grid: res.grid,
      layers: {},
      mapId: res.id,
      removeSSEListener
    })
  );
};

const isLastLayer = (state: State) =>
  state.mapData.totalLayers === state.mapData.loadingLayer.index;

const getMapId = (state: State) => state.mapData.mapId;

const receiveLayer = (e: Event) => (
  dispatch: Dispatch,
  getState: () => State
) => {
  // @ts-ignore
  const data = JSON.parse(e.data);
  dispatch({
    payload: { layer: data.layer },
    type: RECEIVE_LAYER
  });

  if (isLastLayer(getState())) {
    const mapId = getMapId(getState());
    dispatch(downloadMap(mapId));
  }
};

const downloadMap = (mapId: string) => (dispatch: Dispatch): any =>
  fetch(`/api/map/${mapId}`)
    .then(async resp => {
      if (resp.status == 404)
        throw new Error(`Map file '${mapId}' does not exist`);
      return {
        // @ts-ignore (enforced on server)
        filename: resp.headers.get("Content-Disposition").split("filename=")[1],
        blob: await resp.blob()
      };
    })
    .then(function({ filename, blob }) {
      download(blob, filename);
      dispatch(finishedMap());
    })
    .catch((error: Error) => dispatch(submitError(error.message)));

const finishedMap = () => ({
  type: FINISHED_MAP,
  payload: {
    loadingLayer: {
      index: 0,
      name: undefined
    },
    submissionStatus: SubmissionStatus.none
  }
});

const submitError = (errorMessage: string) => ({
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

const clearError = () => ({
  type: CLEAR_ERROR,
  payload: { errorMessage: undefined, submissionStatus: SubmissionStatus.none }
});

const receiveGrid = (payload: any) => ({
  type: RECEIVE_GRID,
  payload
});

const submitting = () => ({ type: SUBMITTING, payload: {} });

export const map = (
  state: MapData | undefined,
  { type, payload }: Action
): MapData => {
  switch (type) {
    default:
      return { ...state, ...payload };
  }
};
