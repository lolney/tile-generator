import React from "react";
import { connect } from "react-redux";
import { ProgressBar } from "baseui/progress-bar";
import styles from "./styles.module.css";
import Button from "../Button";
import ControlButtons from "../ControlButtons";
import { State, SubmissionStatus } from "../../redux/types";
import { progress, downloadMap, resetMap } from "../../redux/modules/map";
import { receivedLayersSelector } from "../../redux/modules/leaflet/selectors";
import { selectLayer } from "../../redux/modules/leaflet";
import { MapLayerValue } from "@tile-generator/common";
import * as colors from "../../constants/colors";

type MapLoaderProps = DispatchProps & StateProps;

type StateProps = {
  downloaded: boolean;
  loadingLayer?: string;
  progress: number;
  receivedLayers: Record<MapLayerValue, boolean>;
  selectedLayer: MapLayerValue | undefined;
  submissionStatus: SubmissionStatus;
};

type DispatchProps = {
  onLayerSelect: (option: MapLayerValue) => void;
  downloadMap: () => void;
  resetMap: () => void;
};

const mapStateToProps = (state: State) => ({
  downloaded: state.mapData.downloaded,
  loadingLayer: state.mapData.loadingLayer.name,
  progress: progress(state),
  receivedLayers: receivedLayersSelector(state),
  selectedLayer: state.leaflet.selectedLayer,
  submissionStatus: state.mapData.submissionStatus,
});

const mapDispatchToProps = {
  onLayerSelect: selectLayer,
  downloadMap,
  resetMap,
};

export const MapLoader: React.FC<MapLoaderProps> = ({
  downloaded,
  downloadMap,
  onLayerSelect,
  progress,
  receivedLayers,
  resetMap,
  selectedLayer,
  submissionStatus,
}) => {
  return (
    <>
      <div className={styles.header}>
        {progress < 1 ? "Building map..." : "Finished building"}
      </div>
      <div className={styles.component_array}>
        {(Object.entries(receivedLayers) as [MapLayerValue, boolean][]).map(
          ([layer, enabled]) => (
            <button
              onClick={() => onLayerSelect(layer)}
              className={
                selectedLayer === layer ? styles.button_selected : styles.button
              }
              disabled={!enabled}
            >
              {layer}
            </button>
          )
        )}
      </div>
      <ProgressBar
        value={progress}
        successValue={1}
        overrides={{
          BarProgress: {
            style: () => {
              return {
                position: "relative",
                backgroundcolor: "#4d90e6",
              };
            },
          },
          Bar: {
            style: ({ $theme }) => ({
              height: $theme.sizing.scale300,
              marginLeft: "30px",
              marginRight: "30px",
              backgroundColor: colors.textFieldGrey,
            }),
          },
        }}
      />
      <ControlButtons>
        <Button
          primary={!downloaded}
          onClick={downloadMap}
          disabled={downloaded || submissionStatus !== SubmissionStatus.done}
        >
          Download
        </Button>
        <Button primary={downloaded} onClick={resetMap}>
          Reset
        </Button>
      </ControlButtons>
    </>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(MapLoader);
