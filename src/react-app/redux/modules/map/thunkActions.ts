import { receiveLayerAction, finishedMap, receiveGrid } from "./actions";
import { isLastLayer } from "./selectors";
import { State } from "../../types";
import { MapDispatch } from "./types";

const createEventSource = (event: string, callback: (e: Event) => any) => {
  let eventSource = new EventSource(event);
  eventSource.addEventListener("layer", callback);

  return () => eventSource.removeEventListener("layer", callback);
};

const receiveLayer = (e: Event) => async (
  dispatch: MapDispatch,
  getState: () => State
) => {
  const data = JSON.parse((e as any).data);
  dispatch(receiveLayerAction(data));

  console.log(getState());
  if (isLastLayer(getState())) {
    dispatch(finishedMap());
  }
};

export const receiveLayers = (resp: Response) => async (
  dispatch: MapDispatch
) => {
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
