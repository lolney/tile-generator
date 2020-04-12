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
import { Polygon, LineString } from "geojson";
import { Tile, MapLayerValue, MapOptions } from "../../common/types";
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
  riverLines: LineString[];
  selectedLayer: MapLayerValue | undefined;
  settings: MapOptions;
};

type DispatchProps = {
  onBoundsChange: (bounds: LatLngBounds) => any;
};

const mapStateToProps: MapStateToProps<StateProps, {}, State> = state => ({
  grid: state.mapData.grid,
  layer: selectedLayer(state),
  riverLines: state.mapData.riverLines,
  selectedLayer: state.leaflet.selectedLayer,
  settings: state.settings
});

const mapDispatchToProps = {
  onBoundsChange: changeBounds
};

class Map extends React.Component<MapProps> {
  map?: L.Map;
  areaSelect?: L.AreaSelect;
  state: {
    layers?: L.GeoJSON<any>[];
    previewLayer?: L.GeoJSON<any>;
  };

  constructor(props: MapProps) {
    super(props);

    this.state = {};
  }

  componentDidMount() {
    const map = (this.map = L.map("map").setView([38, -122], 4));

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);

    // The map will load initially at a smaller size, then fail
    // to update properly for a larger size
    // This doesn't appear to be linked to load/resize events
    setTimeout(() => {
      map.invalidateSize();
    }, 100);

    this.addAreaSelect();
  }

  addAreaSelect = () => {
    // TODO: Aspect ratio should depend on width, height
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
  };

  drawPreviewLayer = () => {
    if (this.map && this.state.previewLayer)
      this.map.removeLayer(this.state.previewLayer);

    const [previewLayer] = this.drawGrid({ preview: true });
    this.setState({ previewLayer });
  };

  createPreviewGrid = () => {
    if (this.areaSelect) {
      const { width, height } = this.props.settings.dimensions;
      const bounds = this.areaSelect.getBounds();
      return createRawHexGrid({
        width,
        height,
        lon_start: bounds.getWest(),
        lon_end: bounds.getEast(),
        lat_start: bounds.getNorth(),
        lat_end: bounds.getSouth()
      });
    }
    return [];
  };

  drawGrid = (options: { preview?: boolean }) => {
    const style = options.preview
      ? () => ({
          opacity: 0.2,
          color: "black"
        })
      : mapFeatureToStyle;

    const grid = options.preview ? this.createPreviewGrid() : this.props.grid;
    const layers: L.GeoJSON<any>[] = [];

    console.log("drawing grid");
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
    layers.push(layer);

    if (this.props.selectedLayer === "rivers")
      layers.push(
        L.geoJSON(
          {
            type: "GeometryCollection",
            // @ts-ignore
            features: this.props.riverLines
          },
          {
            style: () => ({
              color: "blue",
              opacity: 0.5
            })
          }
        ).addTo(this.map)
      );

    return layers;
  };

  componentDidUpdate(prevProps: MapProps) {
    if (
      prevProps.grid !== this.props.grid ||
      prevProps.layer !== this.props.layer ||
      prevProps.riverLines !== this.props.riverLines ||
      prevProps.settings.dimensions !== this.props.settings.dimensions
    ) {
      if (this.map && this.state.layers)
        this.state.layers.forEach(layer => this.map?.removeLayer(layer));

      const layers = this.drawGrid({});
      this.drawPreviewLayer();
      this.setState({ layers });
    }
  }

  render() {
    return <div id="map" />;
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Map);
