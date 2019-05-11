import Map from "./Map";
import { Options } from "../../common/types";
import { LatLngBounds } from "leaflet";
import { connect } from "react-redux";
import { State, SubmissionStatus } from "../redux/types";
import { changeBounds, changeOptions } from "../redux/modules/settings";
import { submit, downloadMap } from "../redux/modules/map";
import OptionsComponent from "./Options";
import Download from "./Download";

const map = {
  mapStateToProps: (state: State) => ({
    layers: state.mapData.layers,
    grid: state.mapData.grid,
    loadingLayer: state.mapData.loadingLayer.name
  }),

  mapDispatchToProps: (dispatch: any) => ({
    onBoundsChange: (bounds: LatLngBounds) => dispatch(changeBounds(bounds))
  })
};

const options = {
  mapStateToProps: (state: State) => ({
    minDimensions: { width: 10, height: 10 },
    maxDimensions: { width: 120, height: 120 },
    selectedOptions: {
      format: state.settings.format,
      dimensions: state.settings.dimensions
    }
  }),
  mapDispatchToProps: (dispatch: any) => ({
    onChange: (options: Options) => dispatch(changeOptions(options)),
    onSubmit: () => dispatch(submit())
  })
};

const download = {
  mapStateToProps: (state: State) => ({
    active: state.mapData.submissionStatus == SubmissionStatus.done
  }),
  mapDispatchToProps: (dispatch: any) => ({
    download: () => dispatch(downloadMap())
  })
};

export const OptionsContainer = connect(
  options.mapStateToProps,
  options.mapDispatchToProps
)(OptionsComponent);

export const MapContainer = connect(
  map.mapStateToProps,
  map.mapDispatchToProps
)(Map);

export const DownloadContainer = connect(
  download.mapStateToProps,
  download.mapDispatchToProps
)(Download);
