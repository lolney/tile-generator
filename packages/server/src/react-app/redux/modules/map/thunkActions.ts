import {
  receiveLayerAction,
  finishedMap,
  receiveGrid,
  receiveRiverLines,
} from "./actions";
import { isLastLayer } from "./selectors";
import { State } from "../../types";
import { MapDispatch } from "./types";
import { LayersType, RiverType } from "@tile-generator/common";
import { BACKEND_URL } from "../../../../constants/values";
import { LineString } from "geojson";
import { mapRiverToLine } from "@tile-generator/common";

const createEventSource = (event: string, callback: (e: Event) => any) => {
  let eventSource = new EventSource(event);
  eventSource.addEventListener("layer", callback);

  return () => eventSource.removeEventListener("layer", callback);
};

const splitRivers = (layer: LayersType) => (
  dispatch: MapDispatch,
  getState: () => State
) => {
  const { rivers } = layer;
  const {
    mapData: { grid },
  } = getState();
  if (!rivers) return;

  const lines = rivers.flatMap((tile, i) => {
    if (!tile.river) return [];
    const poly = grid[i];
    const lines: LineString[] = (Object.entries(tile.river) as [
      keyof RiverType,
      boolean
    ][])
      .map(([direction, bool]) =>
        bool ? mapRiverToLine(poly, direction) : null
      )
      .filter((elem) => elem !== null) as LineString[];
    return lines;
  });
  dispatch(receiveRiverLines(lines));
};

const receiveLayer = (e: Event) => async (
  dispatch: MapDispatch,
  getState: () => State
) => {
  const data = JSON.parse((e as any).data);
  dispatch(receiveLayerAction(data));
  dispatch(splitRivers(data.layer));
  console.log(getState());
  if (isLastLayer(getState())) {
    dispatch(finishedMap());
  }
};

export const receiveLayers = (resp: Response) => async (
  dispatch: MapDispatch
) => {
  const res = await resp.json();

  const removeSSEListener = createEventSource(
    `${BACKEND_URL}/updates/${res.id}`,
    (e: Event) => dispatch(receiveLayer(e))
  );

  dispatch(
    receiveGrid({
      grid: res.grid,
      totalLayers: res.nLayers,
      layers: {},
      mapId: res.id,
      removeSSEListener,
    })
  );
};
