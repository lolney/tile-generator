import React from "react";
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
