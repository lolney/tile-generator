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

interface MapProps {
  onBoundsChange: (bounds: LatLngBounds) => any;
  grid: Array<Polygon>;
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

    // @ts-ignore
    //map.selectArea.setCtrlKey(true);
  }

  componentDidUpdate(prevProps: MapProps) {
    // Add hex grid
    if (prevProps.grid != this.props.grid) {
      L.geoJSON({
        type: "GeometryCollection",
        // @ts-ignore
        geometries: this.props.grid
      }).addTo(this.map);
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
