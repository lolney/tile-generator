import { State } from "../../types";
import download from "downloadjs";
import { downloading, submitError, submitting } from "./actions";
import { selectOptions } from "./selectors";
import { MapDispatch } from "./types";
import { receiveLayers, parseRemainingMaps } from "./thunkActions";
import { BACKEND_URL } from "../../../constants/values";

export const submit = () => (dispatch: MapDispatch, getState: () => State) => {
  dispatch(submitting());
  const options = selectOptions(getState());

  return fetch(`${BACKEND_URL}/api/map`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(options),
  }).then(
    async (resp) => {
      const json = await resp.json();
      dispatch(receiveLayers(json));
      dispatch(parseRemainingMaps(resp, json));
    },
    (error) => dispatch(submitError(error))
  );
};

export const downloadMap = () => async (
  dispatch: MapDispatch,
  getState: () => State
) => {
  dispatch(downloading());

  const state = getState();
  const { downloadUrl } = state.mapData;
  const { format } = state.settings;

  if (!downloadUrl) {
    console.error("downloadUrl not set");
    return;
  }

  const resp = await fetch(downloadUrl);

  if (!resp.ok) dispatch(submitError(await resp.text()));
  else {
    const defaultFilename = (() => {
      switch (format) {
        case "Civ V":
          return "generated-map.Civ5Map";
        case "Civ VI":
          return "generated-map.Civ6Map";
      }
    })();
    const filename =
      resp.headers?.get("Content-Disposition")?.split("filename=")[1] ||
      defaultFilename;
    const blob = await resp.blob();

    download(blob, filename);
  }
};
