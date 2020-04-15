import React from "react";
import Map from "../../components/Map";
import Dock from "../../components/Dock";
import { BaseWeb } from "../../baseweb";
import styles from "./styles.module.css";

export const MapPage: React.FC = () => (
  <BaseWeb>
    <div className={styles.page}>
      <div className={styles.top_bar}>
        <div className={styles.header}>Civilization Map Generator</div>
      </div>
      <div className={styles.map_container}>
        <Map />
        <Dock />
      </div>
      <div className={styles.bottom_bar}></div>
    </div>
  </BaseWeb>
);
