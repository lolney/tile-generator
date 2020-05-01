import React from "react";
import { StatefulTabs, Tab } from "baseui/tabs";
import Button from "../../components/Button";
import styles from "./styles.module.css";
import tabStyle from "../../components/TabStyle";
import { Civ6InstructionList } from "../../components/InstructionList";

const OSTabs: React.FC = () => (
  <StatefulTabs
    initialState={{ activeKey: "0" }}
    overrides={{
      TabBar: {
        style: () => ({
          width: "170px",
          marginLeft: "auto",
          marginRight: "auto",
          backgroundColor: "var(--textfieldGrey)",
        }),
      },
      TabContent: {
        style: () => ({
          fontSize: "13px",
          paddingTop: "20px",
          paddingBottom: "20px",
          color: "var(--textColorWhite)",
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
      <Civ6InstructionList hideTitle os="Mac" />
    </Tab>
    <Tab
      title={"Windows"}
      overrides={{
        Tab: { style: tabStyle },
      }}
    >
      <Civ6InstructionList hideTitle os="Windows" />
    </Tab>
  </StatefulTabs>
);

export const InstructionWindow: React.FC = () => (
  <>
    <div className={styles.screen}>
      <div className={styles.window}>
        <header className={styles.header}>Install Instructions</header>
        <OSTabs></OSTabs>
        <div className={styles.buttonContainer}>
          <Button primary>Ok</Button>
        </div>
      </div>
    </div>
  </>
);

export default InstructionWindow;
