import React from "react";
import { connect } from "react-redux";
import styles from "./styles.module.css";
import Options from "../Options";
import MapLoader from "../MapLoader";
import { State, SubmissionStatus } from "../../redux/types";

const mapStateToProps = (state: State) => ({
  mapInProgress:
    state.mapData.submissionStatus === SubmissionStatus.submitting ||
    state.mapData.submissionStatus === SubmissionStatus.done,
});

interface DockProps {
  mapInProgress: boolean;
}

export const Dock: React.FC<DockProps> = ({ mapInProgress }) => (
  <>
    <div className={styles.container}>
      {mapInProgress ? <MapLoader /> : <Options />}
    </div>
  </>
);

export default connect(mapStateToProps)(Dock);
