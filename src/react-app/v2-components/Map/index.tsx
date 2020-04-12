import React from "react";
import styles from "./styles.module.css";

const Map: React.FC = () => (
  <>
    <div className={styles.top_bar}>
      <div className={styles.header}>Civilization Map Generator</div>
    </div>
    <div className={styles.map}>The map</div>
    <div className={styles.bottom_bar}></div>
  </>
);

export default Map;
