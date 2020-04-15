import React from "react";
import Map from "./Map/index";
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
