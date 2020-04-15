import Map from "./Map";
import { Options } from "../../common/types";
import { LatLngBounds } from "leaflet";
import { connect } from "react-redux";
import { State, SubmissionStatus } from "../redux/types";
import { changeBounds, changeOptions } from "../redux/modules/settings";
import { submit, downloadMap } from "../redux/modules/map";
import OptionsComponent from "./Options";
import Download from "./Download";

const download = {
  mapStateToProps: (state: State) => ({
    active: state.mapData.submissionStatus === SubmissionStatus.done,
  }),
  mapDispatchToProps: (dispatch: any) => ({
    download: () => dispatch(downloadMap()),
  }),
};

export const DownloadContainer = connect(
  download.mapStateToProps,
  download.mapDispatchToProps
)(Download);
