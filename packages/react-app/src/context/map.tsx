import React from "react";

const MapContext: React.Context<L.Map | undefined> = React.createContext(
  undefined
) as React.Context<L.Map | undefined>;

export default MapContext;
