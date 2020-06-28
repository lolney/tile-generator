import React from "react";
import Map from "../../components/Map";
import Dock from "../../components/Dock";
import { BaseWeb } from "../../context/baseweb";
import styles from "./styles.module.css";
import InstructionsModal from "../../components/InstructionsModal";
import Toasts from "../../components/Toasts";
import QuotaCounter from "../../components/QuotaCounter";
import { useLeafletMap } from "../../components/Map/hooks";
import MapContext from "../../context/map";

export const MapPage: React.FC = () => {
  const map = useLeafletMap();

  return (
    <BaseWeb>
      <MapContext.Provider value={map}>
        <div className={styles.page}>
          <div className={styles.map_container}>
            <Map />
            <Dock />
          </div>
          <div className={styles.bottom_bar}>
            <QuotaCounter />
          </div>
          <Toasts />
          <InstructionsModal />
        </div>
      </MapContext.Provider>
    </BaseWeb>
  );
};
