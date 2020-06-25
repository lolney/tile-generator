import React from "react";
import { StatefulTabs, Tab } from "baseui/tabs";
import * as colors from "../../constants/colors";
import Modal from "../../components/Modal";
import {
  OsString,
  InstructionList as IInstructionList,
} from "../InstructionList/types";

const tabStyle = ({ $active, $disabled, $theme }: any) => ({
  outlineColor: colors.textColorWhite,
  borderBottomColor: "#4d90e6",
  fontWeight: 600,
  color: $active ? colors.textColorWhite : "#d6d6d6",
  ":hover": $disabled
    ? {}
    : {
        color: colors.textColorWhite,
      },
  ":focus": $disabled
    ? {}
    : {
        color: colors.textColorWhite,
      },
});

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
