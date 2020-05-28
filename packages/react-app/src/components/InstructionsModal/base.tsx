import React from "react";
import { StatefulTabs, Tab } from "baseui/tabs";
import tabStyle from "../../components/TabStyle";
import Modal from "../../components/Modal";
import {
  OsString,
  InstructionList as IInstructionList,
} from "../InstructionList/types";

interface TabsProps {
  InstructionList: IInstructionList;
  os: OsString;
}

const OSTabs: React.FC<TabsProps> = ({ InstructionList, os }) => (
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
      <InstructionList hideTitle os="Mac" />
    </Tab>
    <Tab
      title={"Windows"}
      overrides={{
        Tab: { style: tabStyle },
      }}
    >
      <InstructionList hideTitle os="Windows" />
    </Tab>
  </StatefulTabs>
);

export const BaseInstructionsModal: React.FC<
  { closeModal: () => void } & TabsProps
> = ({ closeModal, InstructionList, os }) => (
  <Modal onClose={closeModal} header={"Install Instructions"}>
    <OSTabs {...{ InstructionList, os }}></OSTabs>
  </Modal>
);
