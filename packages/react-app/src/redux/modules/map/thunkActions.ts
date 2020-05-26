import {
  receiveLayerAction,
  finishedMap,
  receiveGrid,
  receiveRiverLines,
  receiveErrors,
} from "./actions";
import { setIpRequestsTotal, setIpRequestsCount } from "../toolbar";
import { isLastLayer } from "./selectors";
import { State } from "../../types";
import { MapDispatch } from "./types";
import { LayersType, RiverType, Tile } from "@tile-generator/common";
import { BACKEND_URL } from "../../../constants/values";
import { LineString } from "geojson";
import { mapRiverToLine } from "@tile-generator/common";

const createEventSource = (event: string, callback: (e: Event) => any) => {
  let eventSource = new EventSource(event);
  eventSource.addEventListener("layer", callback);
  eventSource.addEventListener("errors", callback);

  return () => {
    eventSource.removeEventListener("layer", callback);
    eventSource.removeEventListener("errors", callback);
    eventSource.close();
  };
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

  const lines = rivers.flatMap((tile: Tile, i: number) => {
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

// todo: Event should be typed
const receiveLayer = (e: Event) => async (
  dispatch: MapDispatch,
  getState: () => State
) => {
  const data = JSON.parse((e as any).data);

  if (data.layer) {
    dispatch(receiveLayerAction(data));
    dispatch(splitRivers(data.layer));
  } else if (data.errors) {
    console.log("receiving errors:", data);
    dispatch(receiveErrors(data.errors));
  }

  if (isLastLayer(getState())) {
    dispatch(finishedMap());
  }
};

export const parseRemainingMaps = (resp: Response, json: any) => async (
  dispatch: MapDispatch
) => {
  const remainingHeader = resp.headers.get("X-RateLimit-Remaining");
  const totalHeader = resp.headers.get("X-RateLimit-Limit");

  if (!totalHeader || !remainingHeader) return dispatch(receiveErrors([10]));

  const remaining = parseInt(remainingHeader, 10);
  const total = parseInt(totalHeader, 10);

  if (Number.isNaN(remaining) || Number.isNaN(total))
    return dispatch(receiveErrors([10]));

  dispatch(setIpRequestsCount(total - remaining));
  dispatch(setIpRequestsTotal(total));

  if (json?.errors) {
    receiveErrors(json.errors);
  }
};

export const receiveLayers = (res: any) => async (dispatch: MapDispatch) => {
  if (!res.grid) return;

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
