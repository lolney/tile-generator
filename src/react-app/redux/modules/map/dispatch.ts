import { State } from "../../types";
import download from "downloadjs";
import { submitError, submitting } from "./actions";
import { selectOptions } from "./selectors";
import { MapDispatch } from "./types";
import { receiveLayers } from "./thunkActions";
import { BACKEND_URL } from "../../../../constants/values";

export const submit = () => (dispatch: MapDispatch, getState: () => State) => {
  dispatch(submitting());
  const options = selectOptions(getState());

  return fetch(`${BACKEND_URL}/api/map`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(options)
  }).then(
    resp => dispatch(receiveLayers(resp)),
    error => dispatch(submitError(error))
  );
};

export const downloadMap = () => async (
  dispatch: MapDispatch,
  getState: () => State
) => {
  const { mapId } = getState().mapData;
  const resp = await fetch(`${BACKEND_URL}/api/map/${mapId}`);

  if (resp.status === 404)
    dispatch(submitError(`Map file '${mapId}' does not exist`));
  else {
    // @ts-ignore
    const filename = resp.headers
      .get("Content-Disposition")
      .split("filename=")[1];
    const blob = await resp.blob();

    download(blob, filename);
  }
};
