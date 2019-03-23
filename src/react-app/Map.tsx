import React from "react";
//import { Map as LeafletMap, TileLayer } from "react-leaflet";
import L from "leaflet";
// @ts-ignore: noImplicitAny
import "leaflet-area-select";
// Leaflet.Grid

import "leaflet/dist/leaflet.css";
import "./Map.css";

import { LeafletEvent, LatLngBounds } from "leaflet";

interface MapProps {
  onBoundsChange: (bounds: LatLngBounds) => any;
}

export default class Map extends React.Component<MapProps> {
  componentDidMount() {
    // initialize map
    var map = L.map("map").setView([38, 0], 4);

    // @ts-ignore
    map.selectArea.enable();

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // add AreaSelect with keepAspectRatio:true
    map.on("areaselected", (e: any) => {
      this.props.onBoundsChange(e.bounds);
      console.log(e.bounds.toBBoxString()); // lon, lat, lon, lat
    });

    // @ts-ignore
    //map.selectArea.setCtrlKey(true);
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
