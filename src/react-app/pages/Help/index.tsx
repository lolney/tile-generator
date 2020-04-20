import React from "react";
import { StatefulTabs, Tab } from "baseui/tabs";
import { SelectButton } from "../../v2-components/Button";
import { BaseWeb } from "../../baseweb";
import styles from "./styles.module.css";
import * as colors from "../../constants/colors";
import tabStyle from "../../components/TabStyle";
import InstructionWindow from "../../v2-components/InstructionWindow";

export const Help: React.FC = () => (
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
            Map Installation Instructions
          </h1>
        </div>
      </div>
    </div>
  </BaseWeb>
);
