import { Polygon } from "geojson";
import { LayersType, MapOptions } from "../../common/types";

export type State = {
  settings: MapOptions;
  mapData: MapData;
  leaflet: LeafletState;
};

export type MapData = {
  grid: Polygon[];
  layers: LayersType;
  loadingLayer: {
    index: number;
    name?: string;
  };
  mapId?: string;
  removeSSEListener?: Function;
  submissionStatus: SubmissionStatus;
  errorMessage?: string;
  totalLayers?: number;
};

export type LeafletState = {
  selectedLayer: string | undefined;
};

export enum SubmissionStatus {
  submitting,
  errored,
  done,
  none
}
