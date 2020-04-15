import React from "react";
import { connect } from "react-redux";
import { ProgressBar } from "baseui/progress-bar";
import styles from "./styles.module.css";
import ControlButtons from "../ControlButtons";
import { State } from "../../redux/types";
import { progress, downloadMap } from "../../redux/modules/map";
import { receivedLayersSelector } from "../../redux/modules/leaflet/selectors";
import { selectLayer } from "../../redux/modules/leaflet";
import { MapLayerValue } from "../../../common/types";

const mapStateToProps = (state: State) => ({
  progress: progress(state),
  selectedLayer: state.leaflet.selectedLayer,
  receivedLayers: receivedLayersSelector(state),
  loadingLayer: state.mapData.loadingLayer.name,
});

type MapLoaderProps = DispatchProps & StateProps;

type StateProps = {
  selectedLayer: MapLayerValue | undefined;
  receivedLayers: Record<MapLayerValue, boolean>;
  loadingLayer?: string;
  progress: number;
};

type DispatchProps = {
  onLayerSelect: (option: MapLayerValue) => void;
  downloadMap: () => void;
};

const mapDispatchToProps = {
  onLayerSelect: selectLayer,
  downloadMap,
};

export const MapLoader: React.FC<MapLoaderProps> = ({
  progress,
  downloadMap,
  receivedLayers,
  selectedLayer,
  onLayerSelect,
}) => (
  <>
    <div className={styles.header}>
      {progress < 1 ? "Building map..." : "Finished building"}
    </div>
    <div className={styles.component_array}>
      {(Object.entries(receivedLayers) as [MapLayerValue, boolean][]).map(
        ([layer, enabled]) => (
          <button
            onClick={() => onLayerSelect(layer)}
            className={styles.component_btn}
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
            backgroundColor: "#363636",
          }),
        },
      }}
    />
    <ControlButtons
      clickPrimary={downloadMap}
      textPrimary={"Download"}
      textSecondary={"Reset"}
    />
  </>
);

export default connect(mapStateToProps, mapDispatchToProps)(MapLoader);
