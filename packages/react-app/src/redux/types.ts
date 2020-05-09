import { Polygon, Geometry, Feature, LineString } from "geojson";
import {
  LayersType,
  MapOptions,
  Tile,
  MapLayerValue,
  errorCodes,
} from "@tile-generator/common";

export type State = {
  settings: MapOptions;
  mapData: MapData;
  leaflet: LeafletState;
};

export type MapData = {
  downloaded: boolean;
  errorCodes: Array<keyof typeof errorCodes>;
  errorMessage?: string;
  grid: Polygon[];
  layers: LayersType;
  loadingLayer: {
    index: number;
    name?: MapLayerValue;
  };
  mapId?: string;
  removeSSEListener?: Function;
  riverLines: LineString[];
  submissionStatus: SubmissionStatus;
  totalLayers?: number;
};

export type LeafletState = {
  selectedLayer: MapLayerValue | undefined;
};

export enum SubmissionStatus {
  submitting,
  errored,
  done,
  none,
}

export type TileFeature = Feature<Geometry, Tile>;
