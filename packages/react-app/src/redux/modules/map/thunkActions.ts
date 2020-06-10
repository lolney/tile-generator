import {
  receiveLayerAction,
  finishedMap,
  receiveGrid,
  receiveRiverLines,
  receiveErrors,
  receiveDownloadUrl,
} from "./actions";
import { setIpRequestsTotal, setIpRequestsCount } from "../toolbar";
import { isLastLayer } from "./selectors";
import { State } from "../../types";
import { MapDispatch } from "./types";
import { LayersType, RiverType, Tile } from "@tile-generator/common";
import { LineString } from "geojson";
import { mapRiverToLine } from "@tile-generator/common";

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

export const parseRemainingMaps = (headers: Headers) => async (
  dispatch: MapDispatch
) => {
  const remainingHeader = headers.get("X-RateLimit-Remaining");
  const totalHeader = headers.get("X-RateLimit-Limit");

  if (!totalHeader || !remainingHeader) return dispatch(receiveErrors([10]));

  const remaining = parseInt(remainingHeader, 10);
  const total = parseInt(totalHeader, 10);

  if (Number.isNaN(remaining) || Number.isNaN(total))
    return dispatch(receiveErrors([10]));

  dispatch(setIpRequestsCount(total - remaining));
  dispatch(setIpRequestsTotal(total));
};

// todo: Event should be typed
export const receiveLayer = (data: any) => async (
  dispatch: MapDispatch,
  getState: () => State
) => {
  if (data.layer) {
    dispatch(receiveLayerAction(data));
    dispatch(splitRivers(data.layer));
  }
  if (data.errors) {
    dispatch(receiveErrors(data.errors));
  }
  if (data.url) {
    dispatch(receiveDownloadUrl(data.url));
  }
  if (data.grid) {
    dispatch(
      receiveGrid({
        grid: data.grid,
        totalLayers: data.nLayers,
        layers: {},
        mapId: data.id,
      })
    );
  }

  if (isLastLayer(getState())) {
    dispatch(finishedMap());
  }
};

export const readEventStream = (
  reader: ReadableStreamDefaultReader<Uint8Array>
) => async (dispatch: MapDispatch, getState: () => State) => {
  let unfinishedEvent = "";
  const requestId = getState().mapData.requestId;

  while (true) {
    const result = await reader.read();
    const latestId = getState().mapData.requestId;

    if (!latestId || latestId != requestId) {
      reader.cancel();
      console.log("cancelling");
      break;
    }

    if (result.done) break;

    let text = new TextDecoder("utf-8").decode(result.value).split("\n");

    if (text.length < 2 || unfinishedEvent) {
      unfinishedEvent = unfinishedEvent + text[0];
      text = [unfinishedEvent, ...text.slice(1)];
    }

    if (text.length < 2) {
      continue;
    } else {
      unfinishedEvent = "";
    }

    for (const str of text) {
      if (!str) continue;
      console.log(str);
      const event = JSON.parse(str);
      dispatch(receiveLayer(event));
    }
  }
};
