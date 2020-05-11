import React from "react";
import Map from "../../components/Map";
import Dock from "../../components/Dock";
import { BaseWeb } from "../../baseweb";
import styles from "./styles.module.css";
import InstructionsModal from "../../components/InstructionsModal";
import QuotaModal from "../../components/QuotaModal";
import Toasts from "../../components/Toasts";
import QuotaCounter from "../../components/QuotaCounter";

export const MapPage: React.FC = () => (
  <BaseWeb>
    <div className={styles.page}>
      <div className={styles.map_container}>
        <Map />
        <Dock />
      </div>
<<<<<<< Updated upstream
      <div className={styles.bottom_bar}>
        <QuotaCounter></QuotaCounter>
      </div>
=======
<<<<<<< Updated upstream
      <div className={styles.bottom_bar}></div>
=======
      <div className={styles.bottom_bar}>
        <QuotaCounter />
      </div>
>>>>>>> Stashed changes
>>>>>>> Stashed changes
      <Toasts />
      <InstructionsModal />
    </div>
  </BaseWeb>
);
