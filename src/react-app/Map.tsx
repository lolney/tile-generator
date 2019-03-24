import React from "react";
//import { Map as LeafletMap, TileLayer } from "react-leaflet";
import L from "leaflet";
// @ts-ignore: noImplicitAny
import "leaflet-area-select";
// Leaflet.Grid

import "leaflet/dist/leaflet.css";
import "./Map.css";

import { LeafletEvent, LatLngBounds } from "leaflet";
import { Polygon } from "geojson";
import { Tile, TerrainType } from "../common/types";
import { Elevation } from "../common/types";

interface MapProps {
  onBoundsChange: (bounds: LatLngBounds) => any;
  grid: Array<Polygon>;
  layer: Array<Tile>;
}

export default class Map extends React.Component<MapProps> {
  map?: L.Map;

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
      L.geoJSON(
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
                    return { color: "blue" };
                  case TerrainType.grassland:
                    return { color: "green" };
                  default:
                    return {};
                }
              })();

              const elevation = (() => {
                switch (feature.properties.elevation) {
                  case Elevation.flat:
                    if (feature.properties.terrain != TerrainType.coast)
                      return { fillColor: "green" };
                  case Elevation.hill:
                    return { fillColor: "brown" };
                  case Elevation.mountain:
                    return { fillColor: "black" };
                  default:
                }
                return {};
              })();

              return { ...elevation, ...color };
            }
          }
        }
      ).addTo(this.map);
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
