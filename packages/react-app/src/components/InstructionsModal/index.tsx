import React, { useState } from "react";
import { connect } from "react-redux";
import { State } from "../../redux/types";
import { BaseInstructionsModal } from "./base";

interface PropsFromState {
  downloaded: boolean;
}

const mapStateToProps = (state: State) => ({
  downloaded: state.mapData.downloaded,
});

const InstructionsModal: React.FC<PropsFromState> = ({ downloaded }) => {
  const [userHasClosed, setUserHasClosed] = useState(false);

  if (!downloaded && userHasClosed) setUserHasClosed(false);

  return downloaded && !userHasClosed ? (
    <BaseInstructionsModal closeModal={() => setUserHasClosed(true)} />
  ) : null;
};

export default connect(mapStateToProps)(InstructionsModal);
