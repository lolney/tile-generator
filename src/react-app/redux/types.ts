import { Polygon } from "geojson";
import { LayersType, MapOptions } from "../../common/types";

export type State = {
  settings: MapOptions;
  mapData: MapData;
  leaflet: any;
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

export enum SubmissionStatus {
  submitting,
  errored,
  none
}
