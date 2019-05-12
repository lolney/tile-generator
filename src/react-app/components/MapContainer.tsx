import React from "react";
import Map from "./Map";
import MapOptions from "./MapOptions";

const MapContainer: React.SFC = () => {
  return (
    <div>
      <Map />
      <MapOptions />
    </div>
  );
};

export default MapContainer;
