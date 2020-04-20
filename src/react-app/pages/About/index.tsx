import React from "react";
import { BaseWeb } from "../../baseweb";
import Button from "../../components/Button";

import styles from "./styles.module.css";

export const About: React.FC = () => (
  <BaseWeb>
    <div className={styles.page}>
      <div className={styles.top_bar}>
        <div className={styles.header}>Civilization Tile Builder</div>
        <div className={styles.menu_item_container}>
          <div className={styles.menu_item}>About</div>
          <div className={styles.menu_item}>Help</div>
        </div>
      </div>
      <div className={styles.body}>
        <div className={styles.intro}>
          <h1 className={styles.landing_header}>
            Real-world map builder for Civilization
          </h1>
          <p className={styles.landing_subtitle}>
            Generate maps for Civilization V and VI using satellite data
          </p>
          <div className={styles.btn_container}>
            <Button primary>Get started</Button>
            <Button>Github</Button>
          </div>
        </div>
        <video controls>
          <source src="About_Video.mp4" type="video/mp4"></source>
        </video>
      </div>
    </div>
  </BaseWeb>
);
