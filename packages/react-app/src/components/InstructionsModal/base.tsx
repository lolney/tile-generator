import React from "react";
import { StatefulTabs, Tab } from "baseui/tabs";
import tabStyle from "../../components/TabStyle";
import { Civ6InstructionList } from "../../components/InstructionList";
import Modal from "../../components/Modal";

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

export const BaseInstructionsModal: React.FC<{ closeModal: () => void }> = ({
  closeModal,
}) => (
  <Modal onClose={closeModal} header={"Install Instructions"}>
    <OSTabs></OSTabs>
  </Modal>
);
