import React from "react";
import Map from "../../components/Map";
import Dock from "../../components/Dock";
import { BaseWeb } from "../../baseweb";
import styles from "./styles.module.css";
import InstructionsModal from "../../components/InstructionsModal";
import Toasts from "../../components/Toasts";
import QuotaCounter from "../../components/QuotaCounter";
import { BACKEND_URL } from "../../constants/values";

export const MapPage: React.FC = () => {
  return (
    <BaseWeb>
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
    </BaseWeb>
  );
};
