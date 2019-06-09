import React from "react";
import memoize from "memoizee";
import L from "leaflet";
// @ts-ignore: noImplicitAny
import "./areaselect/areaselect";
import _ from "lodash";

import "leaflet/dist/leaflet.css";
import "./Map.css";
import "./areaselect/areaselect.css";

import { LatLngBounds } from "leaflet";
import { Polygon } from "geojson";
import { LayersType, Tile } from "../../common/types";
import createRawHexGrid from "../../common/createRawHexGrid";
import {
  mapFeatureToStyle,
  selectedLayer
} from "../redux/modules/leaflet/selectors";
import { connect, MapStateToProps } from "react-redux";
import { State } from "../redux/types";
import { changeBounds } from "../redux/modules/settings";

type MapProps = DispatchProps & StateProps;

type StateProps = {
  grid: Polygon[];
  layer: Tile[];
};

type DispatchProps = {
  onBoundsChange: (bounds: LatLngBounds) => any;
};

const mapStateToProps: MapStateToProps<StateProps, {}, State> = state => ({
  grid: state.mapData.grid,
  layer: selectedLayer(state)
});

const mapDispatchToProps = {
  onBoundsChange: changeBounds
};

class Map extends React.Component<MapProps> {
  map?: L.Map;
  areaSelect?: L.AreaSelect;
  state: {
    layer?: L.GeoJSON<any>;
    previewLayer?: L.GeoJSON<any>;
  };

  constructor(props: MapProps) {
    super(props);

    this.state = {};

    this.addAreaSelect = this.addAreaSelect.bind(this);
    this.drawPreviewLayer = this.drawPreviewLayer.bind(this);
    this.drawGrid = this.drawGrid.bind(this);
    this.createPreviewGrid = this.createPreviewGrid.bind(this);
  }

  componentDidMount() {
    this.map = L.map("map").setView([38, -122], 4);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);

    this.addAreaSelect();
  }

  addAreaSelect() {
    // Set the dimensions of the box (todo: should depend on size of map)
    // Aspect ratio should depend on width, height
    this.areaSelect = L.areaSelect({
      width: 300,
      height: 300 * (10 / (10 + 0.5)),
      keepAspectRatio: true
    });
    if (this.map) this.areaSelect.addTo(this.map);

    // @ts-ignore
    this.areaSelect.on("change", () => {
      // @ts-ignore
      this.props.onBoundsChange(this.areaSelect.getBounds());
      this.drawPreviewLayer();
    });

    this.drawPreviewLayer();
  }

  drawPreviewLayer() {
    console.log("drawing preview layer", this.map, this.state.previewLayer);
    if (this.map && this.state.previewLayer)
      this.map.removeLayer(this.state.previewLayer);

    const previewLayer = this.drawGrid({ preview: true });
    this.setState({ previewLayer });
  }

  createPreviewGrid() {
    if (this.areaSelect) {
      const bounds = this.areaSelect.getBounds();
      return createRawHexGrid({
        width: 10, // TODO: connect to actual width, height
        height: 10,
        lon_start: bounds.getWest(),
        lon_end: bounds.getEast(),
        lat_start: bounds.getNorth(),
        lat_end: bounds.getSouth()
      });
    }
    return [];
  }

  drawGrid(options: { preview?: boolean }) {
    const style = options.preview
      ? () => ({
          opacity: 0.2,
          color: "black"
        })
      : mapFeatureToStyle;

    const grid = options.preview ? this.createPreviewGrid() : this.props.grid;

    const layer = L.geoJSON(
      {
        type: "FeatureCollection",
        // @ts-ignore
        features: grid.map((hex, i) => ({
          geometry: hex,
          properties: this.props.layer[i],
          type: "Feature"
        }))
      },
      { style }
    ).addTo(this.map);

    return layer;
  }

  componentDidUpdate(prevProps: MapProps) {
    // Add hex grid
    if (
      prevProps.grid != this.props.grid ||
      prevProps.layer != this.props.layer
    ) {
      if (this.map && this.state.layer) this.map.removeLayer(this.state.layer);

      const layer = this.drawGrid({});
      this.setState({ layer });
    }
  }

  render() {
    return <div id="map" />;
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Map);
