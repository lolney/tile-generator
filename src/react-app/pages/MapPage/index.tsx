import React from "react";
import Map from "../../v2-components/Map";
import Dock from "../../v2-components/Dock";
import { BaseWeb } from "../../baseweb";

export const MapPage: React.FC = () => (
  <BaseWeb>
    <Map />
    <Dock />
  </BaseWeb>
);
