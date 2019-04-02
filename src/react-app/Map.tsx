import React from "react";
//import { Map as LeafletMap, TileLayer } from "react-leaflet";
import L from "leaflet";
// @ts-ignore: noImplicitAny
import "leaflet-area-select";
import _ from "lodash";

import "leaflet/dist/leaflet.css";
import "./Map.css";

import { LeafletEvent, LatLngBounds } from "leaflet";
import { Polygon } from "geojson";
import { Tile, TerrainType } from "../common/types";
import { Elevation } from "../common/types";
import { FeatureType } from "../common/types";

interface MapProps {
  onBoundsChange: (bounds: LatLngBounds) => any;
  grid: Array<Polygon>;
  layer: Array<Tile>;
}

export default class Map extends React.Component<MapProps> {
  map?: L.Map;
  state: {
    layer?: L.GeoJSON<any>;
  };

  constructor(props: MapProps) {
    super(props);

    this.state = {};
  }

  componentDidMount() {
    this.map = L.map("map").setView([38, 0], 4);

    // @ts-ignore
    this.map.selectArea.enable();

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);

    // add AreaSelect with keepAspectRatio:true
    this.map.on("areaselected", (e: any) => {
      this.props.onBoundsChange(e.bounds);
      console.log(e.bounds.toBBoxString()); // lon, lat, lon, lat
    });
  }

  componentDidUpdate(prevProps: MapProps) {
    // Add hex grid
    if (
      prevProps.grid != this.props.grid ||
      prevProps.layer != this.props.layer
    ) {
      if (this.map && this.state.layer) this.map.removeLayer(this.state.layer);

      const layer = L.geoJSON(
        {
          type: "FeatureCollection",
          // @ts-ignore
          features: this.props.grid.map((hex, i) => ({
            geometry: hex,
            properties: this.props.layer[i],
            type: "Feature"
          }))
        },
        {
          style: function(feature) {
            if (feature === undefined || feature.properties === undefined) {
              return {};
            } else {
              const color = (() => {
                switch (feature.properties.terrain) {
                  case TerrainType.coast:
                    return { color: "cyan" };
                  case TerrainType.ocean:
                    return { color: "blue" };
                  case TerrainType.grass:
                    return { color: "green" };
                  case TerrainType.plains:
                    return { color: "gold" };
                  case TerrainType.desert:
                    return { color: "sandybrown" };
                  case TerrainType.tundra:
                    return { color: "grey" };
                  case TerrainType.ice:
                    return { color: "white" };
                  default:
                    return {};
                }
              })();

              const elevation = (() => {
                switch (feature.properties.elevation) {
                  case Elevation.flat:
                    if (feature.properties.terrain != TerrainType.coast)
                      return { fillColor: "green" };
                  case Elevation.hills:
                    return { fillColor: "brown" };
                  case Elevation.mountain:
                    return { fillColor: "black" };
                  default:
                }
                return {};
              })();

              const terrainFeature = (() => {
                switch (feature.properties.feature) {
                  case FeatureType.forest:
                    return { fillColor: "DarkOliveGreen" };
                  case FeatureType.jungle:
                    return { fillColor: "black" };
                  default:
                    return {};
                }
              })();

              const rivers = (() => {
                if (
                  !feature.properties.river ||
                  _.isEqual(feature.properties.river, {})
                ) {
                  return {};
                } else {
                  return { fillColor: "blue" };
                }
              })();

              return { ...elevation, ...color, ...terrainFeature, ...rivers };
            }
          }
        }
      ).addTo(this.map);

      this.setState({ layer });
    }
  }

  onMoveEnd(e: LeafletEvent) {
    console.log("move");
    this.props.onBoundsChange(e.target.getBounds());
  }

  render() {
    return <div id="map" />;
  }
}

/**
 Leaflet map todo:
 - Aspect ratio locking
 */
