import React from "react";
import Map from "../../components/Map";
import Dock from "../../components/Dock";
import { BaseWeb } from "../../baseweb";
import styles from "./styles.module.css";
import InstructionsModal from "../../components/InstructionsModal";
import Toasts from "../../components/Toasts";

export const MapPage: React.FC = () => (
  <BaseWeb>
    <div className={styles.page}>
      <div className={styles.map_container}>
        <Map />
        <Dock />
      </div>
      <div className={styles.bottom_bar}></div>
      <Toasts />
      <InstructionsModal />
    </div>
  </BaseWeb>
);
