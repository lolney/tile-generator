import React from "react";
import Map from "../../components/Map";
import Dock from "../../components/Dock";
import { BaseWeb } from "../../baseweb";
import styles from "./styles.module.css";
import InstructionWindow from "../../v2-components/InstructionWindow";

export const MapPage: React.FC = () => (
  <BaseWeb>
    <div className={styles.page}>
      <div className={styles.top_bar}>
        <div className={styles.header}>Civilization Tile Builder</div>
        <div className={styles.menu_item_container}>
          <div className={styles.menu_item}>About</div>
          <div className={styles.menu_item}>Help</div>
        </div>
      </div>
      <div className={styles.map_container}>
        <Map />
        <Dock />
      </div>
      <div className={styles.bottom_bar}></div>
    </div>
  </BaseWeb>
);
