import { State, SubmissionStatus } from "../../types";

export const isLastLayer = (state: State) =>
  state.mapData.totalLayers !== undefined &&
  state.mapData.totalLayers === state.mapData.loadingLayer.index;

export const progress = ({
  mapData: {
    totalLayers,
    submissionStatus,
    loadingLayer: { index },
  },
}: State) => {
  if (submissionStatus === SubmissionStatus.done) return 1;
  return totalLayers != null && index != null ? index / totalLayers : 0;
};

export const selectMapId = (state: State) => state.mapData.mapId;
export const selectOptions = (state: State) => state.settings;
