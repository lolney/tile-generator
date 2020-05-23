import { MapDispatch } from "../map/types";
import { BACKEND_URL } from "../../../constants/values";
import {
  setGlobalRequestsTotal,
  setGlobalRequestsCount,
  setIpRequestsTotal,
  setIpRequestsCount,
} from "./actions";

export const fetchGlobalLimits = () => (dispatch: MapDispatch) =>
  fetch(`${BACKEND_URL}/limits/global/${encodeURIComponent("/api/map")}`)
    .then((resp) => resp.json())
    .then((json) => {
      dispatch(setGlobalRequestsTotal(json.limit));
      dispatch(setGlobalRequestsCount(json.limit - json.remaining));
    });

export const fetchIpLimits = () => (dispatch: MapDispatch) =>
  fetch(`${BACKEND_URL}/limits/ip/${encodeURIComponent("/api/map")}`)
    .then((resp) => resp.json())
    .then((json) => {
      dispatch(setIpRequestsTotal(json.limit));
      dispatch(setIpRequestsCount(json.limit - json.remaining));
    });
