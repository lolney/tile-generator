import { Polygon, Geometry, Feature, LineString } from "geojson";
import {
  LayersType,
  MapOptions,
  Tile,
  MapLayerValue,
} from "@tile-generator/common";

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
    name?: MapLayerValue;
  };
  riverLines: LineString[];
  mapId?: string;
  removeSSEListener?: Function;
  submissionStatus: SubmissionStatus;
  errorMessage?: string;
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
