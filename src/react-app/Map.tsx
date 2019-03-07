import React from "react";
import { Map as LeafletMap, TileLayer } from "react-leaflet";
// @ts-ignore: noImplicitAny
import SelectArea from "leaflet-area-select";
// Leaflet.Grid

import "leaflet/dist/leaflet.css";

import { LeafletEvent, LatLngBounds } from "leaflet";

interface MapProps {
  onBoundsChange: (bounds: LatLngBounds) => any;
}

export default class Map extends React.Component<MapProps> {
  componentDidMount() {
    /*// initialize map
    var map = L.map("map").setView([38, 0], 4);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // add AreaSelect with keepAspectRatio:true
    map.on("areaselected", (e: any) => {
      console.log(e.bounds.toBBoxString()); // lon, lat, lon, lat
    });*/
  }

  onMoveEnd(e: LeafletEvent) {
    console.log("move");
    this.props.onBoundsChange(e.target.getBounds());
  }

  render() {
    return (
      <LeafletMap
        style={{ height: "80vh", width: "100vw" }}
        center={[2.935403, 101.448205]}
        zoom={4}
        onMoveend={this.onMoveEnd.bind(this)}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />
      </LeafletMap>
    );
  }
}
