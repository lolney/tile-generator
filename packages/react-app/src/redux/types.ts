import { Polygon, Geometry, Feature, LineString } from "geojson";
import {
  LayersType,
  MapOptions,
  Tile,
  MapLayerValue,
  errorCodes,
} from "@tile-generator/common";

export type State = {
  settings: Settings;
  mapData: MapData;
  leaflet: LeafletState;
  toolbar: ToolbarState;
};

export type MapData = {
  downloaded: boolean;
  downloadUrl?: string;
  errorCodes: Array<keyof typeof errorCodes>;
  errorMessage?: string;
  grid: Polygon[];
  layers: LayersType;
  loadingLayer: {
    index: number;
    name?: MapLayerValue;
  };
  mapId?: string;
  requestId?: string;
  removeSSEListener?: Function;
  riverLines: LineString[];
  submissionStatus: SubmissionStatus;
  totalLayers?: number;
};

export type Settings = MapOptions & {
  dirty: boolean;
};

export type LeafletState = {
  selectedLayer: MapLayerValue | null;
  startPosition: StartPosition;
};

export type ToolbarState = {
  ipCount: number;
  ipTotal: number;
  globalCount: number;
  globalTotal: number;
};

export type StartPosition = {
  center: L.LatLngExpression;
  zoom: number;
};

export enum SubmissionStatus {
  submitting,
  errored,
  done,
  none,
}

export type TileFeature = Feature<Geometry, Tile>;
