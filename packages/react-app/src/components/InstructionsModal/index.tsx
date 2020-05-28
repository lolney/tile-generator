import React, { useState } from "react";
import { connect } from "react-redux";
import { State } from "../../redux/types";
import { BaseInstructionsModal } from "./base";
import {
  Civ6InstructionList,
  Civ5InstructionList,
} from "../../components/InstructionList";
import { GameString } from "@tile-generator/common";
import { OsString, InstructionList } from "../InstructionList/types";

interface PropsFromState {
  downloaded: boolean;
  format: GameString;
}

const mapStateToProps = (state: State) => ({
  downloaded: state.mapData.downloaded,
  format: state.settings.format,
});

const componentMap: {
  [key in GameString]: InstructionList;
} = {
  "Civ V": Civ5InstructionList,
  "Civ VI": Civ6InstructionList,
};

const InstructionsModal: React.FC<PropsFromState> = ({
  downloaded,
  format,
}) => {
  const [userHasClosed, setUserHasClosed] = useState(false);

  if (!downloaded && userHasClosed) setUserHasClosed(false);

  const baseProps = {
    InstructionList: componentMap[format],
    closeModal: () => setUserHasClosed(true),
    os: (window.navigator.platform.includes("Mac")
      ? "Mac"
      : "Windows") as OsString,
  };

  return downloaded && !userHasClosed ? (
    <BaseInstructionsModal {...baseProps} />
  ) : null;
};

export default connect(mapStateToProps)(InstructionsModal);
