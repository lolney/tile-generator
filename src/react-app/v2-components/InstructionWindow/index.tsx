import React from "react";
import { StatefulTabs, Tab } from "baseui/tabs";
import { SelectButton } from "../Button";
import styles from "./styles.module.css";
import * as colors from "../../constants/colors";
import tabStyle from "../../components/TabStyle";

const OSTabs: React.FC = () => (
  <StatefulTabs
    initialState={{ activeKey: "0" }}
    overrides={{
      TabBar: {
        style: () => ({
          background: colors.backgroundGrey,
          width: "170px",
          marginLeft: "auto",
          marginRight: "auto",
        }),
      },
      TabContent: {
        style: () => ({
          color: colors.textColorWhite,
          fontSize: "13px",
          paddingTop: "20px",
          paddingBottom: "20px",
        }),
      },
    }}
  >
    <Tab
      title={"MacOS"}
      overrides={{
        Tab: { style: tabStyle },
      }}
    >
      <header className={styles.instructionHeader}>1. Install your map </header>
      <ul>
        <li className={styles.instructionList}>
          Install by putting the map in the Civ 6 WorldBuilder folder
        </li>
        <li className={styles.instructionList}>
          To find it in Finder, hold Command-Shift-G to open the "Go to
          Folder..." menu, then enter:{" "}
          <em>
            ~/Library/Application Support/Sid Meier's Civilization
            VI/Saves/WorldBuilder.
          </em>
        </li>
      </ul>
      <header className={styles.instructionHeader}>2. Play your map </header>
      <ul>
        <li className={styles.instructionList}>
          Create a game with "Create Game"
        </li>
        <li className={styles.instructionList}>
          In the setup screen, click the map type under "Choose a Map" to open
          the map selector
        </li>
        <li className={styles.instructionList}>
          Find your map under "Worldbuilder Maps"
        </li>
      </ul>
    </Tab>
    <Tab
      title={"Windows"}
      overrides={{
        Tab: { style: tabStyle },
      }}
    >
      Windows
    </Tab>
  </StatefulTabs>
);

export const InstructionWindow: React.FC = () => (
  <>
    <div className={styles.screen}>
      <div className={styles.window}>
        <div className={styles.header}>Install Instructions</div>
        <OSTabs></OSTabs>
        <SelectButton></SelectButton>
      </div>
    </div>
  </>
);

export default InstructionWindow;
