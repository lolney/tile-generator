import React from "react";
import { BrowserRouter } from "react-router-dom";
import { StatefulTabs, Tab } from "baseui/tabs";
import { BaseWeb } from "../../baseweb";
import styles from "./styles.module.css";
import {
  Civ5InstructionList,
  Civ6InstructionList,
} from "../../components/InstructionList";

const tabStyle = {
  borderBottomColor: "#4d90e6",
  fontSize: "18px",
  fontFamily: "Avenir",
};

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
          <Civ5InstructionList os="Mac" />
        </div>
        <div className={styles.civ6Instructions}>
          <Civ6InstructionList os="Mac" />
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
          <Civ5InstructionList os="Windows" />
        </div>
        <div className={styles.civ6Instructions}>
          <Civ6InstructionList os="Windows" />
        </div>
      </div>
    </Tab>
  </StatefulTabs>
);

const FAQ: React.FC = () => (
  <BrowserRouter>
    <div className={styles.intro}>
      <h1 className={styles.landing_header}>FAQ</h1>
      <div className={styles.faq_body}>
        <h2 className={styles.questionHeader} id="errorQuestion">
          What does the error <em>"Not enough land tiles..."</em> mean?
          <p className={styles.answerText}>
            This means that there are not enough land (non-water) tiles for the
            game to generate starting positions for all the civilizations. To
            remedy this, reset and create a new map with more land tiles.
            Alternatively, you may choose to ignore the error and manually add
            land tiles to your map in the games's World Builder.{" "}
          </p>
        </h2>
        <h2 className={styles.questionHeader} id="quotaQuestion">
          Is there a limit to the number of maps that I can create?
          <p className={styles.answerText}>
            Sadly, yes. In order to run this site economically, we have to put a
            cap on the number of maps you can generate per day. This number is
            displayed in the lower left hand corner of the main page. The total
            number of maps (for one day) generated by all users of the site is
            also displayed. When either you reach your personal daily quota, or
            the site reaches its daily quota, you won't be able to generate any
            more maps until the next day.
          </p>
          <p className={styles.answerText}>
            If you'd like to help expand the capability of the site and allow
            for more map generations, you can pitch in by going here:{" "}
            <a href="https://www.buymeacoffee.com/tilegenerator">
              https://www.buymeacoffee.com/tilegenerator
            </a>
          </p>
        </h2>
        <h2 className={styles.questionHeader}>
          Why do I get an error message when I try to load my map in
          Civilization VI?
        </h2>
        <p className={styles.answerText}>
          This is likely related to a known bug in Civilization VI involving
          starting positions on custom maps (you can read more about it{" "}
          <a href="https://forums.civfanatics.com/threads/1-0-0-341-when-a-civilization-is-not-given-a-starting-plot-the-game-crashes-to-main-menu.648359/">
            here
          </a>
          ). As a result, Civilization Tile Generator imposes a limit on the
          number of city states per game, which is 1.5x the maximum number of
          civilizations on a given map size. For example, a small map can
          support up to 6 civilizations, so the maximum number of cities states
          would be 9. Adding more than 9 city states in this case will generate
          and error and the game will fail to load. Until Civilization VI is
          patched or Civilization Tile Generator devises a better way to handle
          the bug, this problem will persist.
        </p>
        <h2 className={styles.questionHeader}>Where can I report issues?</h2>
        <p className={styles.answerText}>
          You can report issues here:{" "}
          <a href="https://github.com/lolney/tile-generator/issues">
            https://github.com/lolney/tile-generator/issues
          </a>
        </p>
      </div>
    </div>
  </BrowserRouter>
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
        <FAQ></FAQ>
      </div>
      <div className={styles.bottom_bar}></div>
    </div>
  </BaseWeb>
);
