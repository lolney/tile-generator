import React from "react";
import { StatefulTabs, Tab } from "baseui/tabs";
import { BaseWeb } from "../../baseweb";
import styles from "./styles.module.css";

const tabStyle = ({ $active, $disabled, $theme }: any) => ({
  borderBottomColor: "#4d90e6",
  fontSize: "18px",
  fontFamily: "Avenir",
});

const OSTabs: React.FC = () => (
  <StatefulTabs
    initialState={{ activeKey: "0" }}
    overrides={{
      TabBar: {
        style: () => ({
          background: "white",
          width: "170px",
          marginLeft: "auto",
          marginRight: "auto",
        }),
      },
      TabContent: {
        style: () => ({
          color: "black",
          fontSize: "13px",
          paddingTop: "50px",
          paddingBottom: "50px",
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
      <div className={styles.contentsContainer}>
        <div className={styles.civ5Instructions}>
          <h1>Civilization V</h1>
          <header className={styles.instructionHeader}>
            1. Install your map
          </header>
          <ul>
            <li className={styles.instructionList}>
              Install by putting the map in the Civ 5 Maps folder
            </li>
            <li className={styles.instructionList}>
              To find it in Finder, hold Command-Shift-G to open the "Go to
              Folder..." menu, then enter:
              <em>
                ~/Library/Application Support/Sid Meier's Civilization 5/Maps.
              </em>
            </li>
          </ul>
          <header className={styles.instructionHeader}>2. Play your map</header>
          <ul>
            <li className={styles.instructionList}>
              From the main menu, create a game via "Single Player" -> "Set Up
              Game"
            </li>
            <li className={styles.instructionList}>
              Select "Map Type" -> "Additional Maps"
            </li>
            <li className={styles.instructionList}>
              Select the map with the name of the file you downloaded, by
              default "TileBuilder"
            </li>
          </ul>
        </div>
        <div className={styles.civ6Instructions}>
          <h1>Civilization VI</h1>

          <header className={styles.instructionHeader}>
            1. Install your map
          </header>
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
          <header className={styles.instructionHeader}>
            2. Play your map{" "}
          </header>
          <ul>
            <li className={styles.instructionList}>
              Create a game with "Create Game"
            </li>
            <li className={styles.instructionList}>
              In the setup screen, click the map type under "Choose a Map" to
              open the map selector
            </li>
            <li className={styles.instructionList}>
              Find your map under "Worldbuilder Maps"
            </li>
          </ul>
        </div>
      </div>
    </Tab>
    <Tab
      title={"Windows"}
      overrides={{
        Tab: { style: tabStyle },
      }}
    >
      <div className={styles.contentsContainer}>
        <div className={styles.civ5Instructions}>
          <h1>Civilization V</h1>
          <header className={styles.instructionHeader}>
            1. Install your map
          </header>
          <ul>
            <li className={styles.instructionList}>
              Install by copying and pasting the map (named “TileBuilder” by
              default) into the Civ 5 Maps folder
            </li>
            <li className={styles.instructionList}>
              To find this folder, open File Explorer and navigate to:{" "}
              <em>
                Program Files (x86)/Steam/SteamApps/Common/Sid Meier’s
                Civilization V/Assets/Maps
              </em>
            </li>
          </ul>
          <header className={styles.instructionHeader}>2. Play your map</header>
          <ul>
            <li className={styles.instructionList}>
              From the main menu, create a game via "Single Player" -> "Set Up
              Game"
            </li>
            <li className={styles.instructionList}>
              Select "Map Type" -> "Additional Maps"
            </li>
            <li className={styles.instructionList}>
              Select the map with the name of the file you downloaded, by
              default "TileBuilder"
            </li>
          </ul>
        </div>
        <div className={styles.civ6Instructions}>
          <h1>Civilization VI</h1>

          <header className={styles.instructionHeader}>
            1. Install your map
          </header>
          <ul>
            <li className={styles.instructionList}>
              Install by putting the map in the Civ 6 WorldBuilder folder
            </li>
            <li className={styles.instructionList}>
              To find this folder, open File Explorer and navigate to:{" "}
              <em>
                Documents/My Games/Sid Meier's CivilizationVI/Saves/WorldBuilder
              </em>
            </li>
          </ul>
          <header className={styles.instructionHeader}>
            2. Play your map{" "}
          </header>
          <ul>
            <li className={styles.instructionList}>
              Create a game with "Create Game"
            </li>
            <li className={styles.instructionList}>
              In the setup screen, click the map type under "Choose a Map" to
              open the map selector
            </li>
            <li className={styles.instructionList}>
              Find your map under "Worldbuilder Maps"
            </li>
          </ul>
        </div>
      </div>
    </Tab>
  </StatefulTabs>
);

export const Help: React.FC = () => (
  <BaseWeb>
    <div className={styles.page}>
      <div className={styles.body}>
        <div className={styles.intro}>
          <h1 className={styles.landing_header}>
            Map Installation Instructions
          </h1>
          <OSTabs></OSTabs>
        </div>
      </div>
    </div>
  </BaseWeb>
);
