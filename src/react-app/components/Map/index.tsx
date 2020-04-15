import React from "react";

import "../areaselect/areaselect";
import "leaflet/dist/leaflet.css";
import "./styles.css";
import "../areaselect/areaselect.css";

import { LatLngBounds } from "leaflet";
import { Polygon, LineString } from "geojson";
import { Tile, MapLayerValue, MapOptions } from "../../../common/types";
import { selectedLayer } from "../../redux/modules/leaflet/selectors";
import { connect, MapStateToProps } from "react-redux";
import { State } from "../../redux/types";
import { changeBounds } from "../../redux/modules/settings";
import {
  useLeafletMap,
  useAreaSelect,
  usePreviewLayer,
  useTileLayer,
  useRiverLayer,
} from "./hooks";

type MapProps = DispatchProps & StateProps;

type StateProps = {
  grid: Polygon[];
  layer: Tile[];
  riverLines: LineString[];
  selectedLayer: MapLayerValue | undefined;
  settings: MapOptions;
};

type DispatchProps = {
  onBoundsChange: (bounds: LatLngBounds) => any;
};

const mapStateToProps: MapStateToProps<StateProps, {}, State> = (state) => ({
  grid: state.mapData.grid,
  layer: selectedLayer(state),
  riverLines: state.mapData.riverLines,
  selectedLayer: state.leaflet.selectedLayer,
  settings: state.settings,
});

const mapDispatchToProps = {
  onBoundsChange: changeBounds,
};

const Map: React.FC<MapProps> = ({
  onBoundsChange,
  settings,
  selectedLayer,
  riverLines,
  grid,
  layer,
}) => {
  const map = useLeafletMap();
  const areaSelect = useAreaSelect(map, onBoundsChange);

  usePreviewLayer(map, areaSelect, onBoundsChange, settings);
  useRiverLayer(map, selectedLayer, riverLines);
  useTileLayer(map, grid, layer);

  return <div id="map" />;
};

export default connect(mapStateToProps, mapDispatchToProps)(Map);
