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

  const { mapId } = getState().mapData;
  const resp = await fetch(`${BACKEND_URL}/api/map/${mapId}`);

  if (resp.status === 404)
    dispatch(submitError(`Map file '${mapId}' does not exist`));
  else {
    const filename =
      resp.headers?.get("Content-Disposition")?.split("filename=")[1] ||
      "generated-map.Civ6Map";
    const blob = await resp.blob();

    download(blob, filename);
  }
};
