import { State, SubmissionStatus, MapData } from "../../types";
import download from "downloadjs";
import {
  RECEIVE_LAYER,
  FINISHED_MAP,
  RECEIVE_GRID,
  SUBMITTING,
  CLEAR_ERROR
} from "./actionTypes";
import { LayersType } from "../../../../common/types";

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

const initialState: MapData = {
  grid: [],
  layers: {},
  loadingLayer: {
    index: 0
  },
  submissionStatus: SubmissionStatus.none
};

const selectMapId = (state: State) => state.mapData.mapId;
const selectOptions = (state: State) => state.settings;

export const submit = () => (dispatch: Dispatch, getState: () => State) => {
  dispatch(submitting());
  const options = selectOptions(getState());

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

const createEventSource = (event: string, callback: (e: Event) => any) => {
  let eventSource = new EventSource(event);
  eventSource.addEventListener("layer", callback);

  return () => eventSource.removeEventListener("layer", callback);
};

const receiveLayers = (resp: Response) => async (dispatch: Dispatch) => {
  const res = await resp.json();

  const removeSSEListener = createEventSource(`updates/${res.id}`, (e: Event) =>
    dispatch(receiveLayer(e))
  );

  dispatch(
    receiveGrid({
      grid: res.grid,
      totalLayers: res.nLayers,
      layers: {},
      mapId: res.id,
      removeSSEListener
    })
  );
};

const isLastLayer = (state: State) =>
  state.mapData.totalLayers !== undefined &&
  state.mapData.totalLayers === state.mapData.loadingLayer.index;

const receiveLayer = (e: Event) => (
  dispatch: Dispatch,
  getState: () => State
) => {
  // @ts-ignore
  const data = JSON.parse(e.data);
  dispatch(receiveLayerAction(data));

  console.log(getState());
  if (isLastLayer(getState())) {
    dispatch(finishedMap());
  }
};

export const receiveLayerAction = (data: { layer: LayersType }) => ({
  payload: { layer: data.layer },
  type: RECEIVE_LAYER as typeof RECEIVE_LAYER
});

export const downloadMap = () => async (
  dispatch: Dispatch,
  getState: () => State
) => {
  const { mapId } = getState().mapData;
  const resp = await fetch(`/api/map/${mapId}`);

  if (resp.status == 404)
    dispatch(submitError(`Map file '${mapId}' does not exist`));
  else {
    // @ts-ignore
    const filename = resp.headers
      .get("Content-Disposition")
      .split("filename=")[1];
    const blob = await resp.blob();

    download(blob, filename);
  }
};

const finishedMap = () => ({
  type: FINISHED_MAP,
  payload: {
    loadingLayer: {
      index: 0,
      name: undefined
    },
    submissionStatus: SubmissionStatus.done
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

export const submitting = () => ({
  type: SUBMITTING as typeof SUBMITTING,
  payload: {
    errorMessage: undefined,
    submissionStatus: SubmissionStatus.errored
  }
});

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
