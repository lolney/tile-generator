type Action = ReturnType<typeof receiveGrid> | ReturnType<typeof submitting>;

const initialState = {
  grid: [],
  remainingLayers: undefined,
  layers: {}
};

const SUBMITTING = "SUBMITTING";
const RECEIVE_TILE = "RECEIVE_TITLE";
const RECEIVE_LAYERS = "RECEIVE_LAYERS";
const RECEIVE_MAP = "RECEIVE_MAP";
const RECEIVE_GRID = "RECEIVE_GRID";

const submit = options => {
  return dispatch => {
    dispatch(submitting());

    return fetch("/api/map", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(options)
    }).then(
      resp => dispatch(receiveGrid(resp)),
      error => dispatch(submitError(error))
    );
  };
};

const receiveLayers = dispatch => async resp => {
  const res = await resp.json();
  const layerCounter = new LayerCounter();

  let eventSource = new EventSource(`updates/${res.id}`);

  dispatch(
    receiveGrid({
      grid: res.grid,
      layers: {},
      loadingLayer: layerCounter.next(),
      eventSource
    })
  );

  eventSource.addEventListener("layer", (e: Event) =>
    dispatch(receiveLayer(e))
  );
};

const receiveLayer = (e: Event) => {
  // @ts-ignore
  const data = JSON.parse(e.data);
  const loadingLayer = layerCounter.next();
  this.setState({
    layers: { ...this.state.layers, ...data.layer },
    loadingLayer
  });

  console.log("loading layer", loadingLayer);

  if (loadingLayer === undefined) {
    eventSource.removeEventListener("layer", callback);

    fetch(`/api/map/${res.id}`)
      .then(async resp => {
        if (resp.status == 404)
          throw new Error(`Map file '${res.id}' does not exist`);
        return {
          // @ts-ignore (enforced on server)
          filename: resp.headers
            .get("Content-Disposition")
            .split("filename=")[1],
          blob: await resp.blob()
        };
      })
      .then(function({ filename, blob }) {
        download(blob, filename);
      })
      .finally(() => this.resetState());
  }
};

const submitError = error => ({});

const receiveGrid = resp => ({
  type: RECEIVE_GRID,
  payload: {}
});

const submitting = () => ({ type: SUBMITTING, payload: {} });

export const map = (state = initialState, { type, payload }: Action) => {
  switch (type) {
    default:
      return state;
  }
};
