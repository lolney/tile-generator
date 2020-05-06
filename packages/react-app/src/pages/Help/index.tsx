import React from "react";
import { BrowserRouter, Route, NavLink } from "react-router-dom";
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
    </div>
  </BaseWeb>
);
