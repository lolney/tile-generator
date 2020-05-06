import React from "react";
import Map from "../../components/Map";
import Dock from "../../components/Dock";
import { BaseWeb } from "../../baseweb";
import styles from "./styles.module.css";
import InstructionsModal from "../../components/InstructionsModal";
import ToastError from "../../v2-components/ToastError";

export const MapPage: React.FC = () => (
  <BaseWeb>
    <div className={styles.page}>
      <div className={styles.map_container}>
        <Map />
        <Dock />
      </div>
      <div className={styles.bottom_bar}></div>
      <ToastError />
      <InstructionsModal />
    </div>
  </BaseWeb>
);
