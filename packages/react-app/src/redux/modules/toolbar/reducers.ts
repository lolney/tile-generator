import {
  SET_IP_REQUESTS_COUNT,
  SET_IP_REQUESTS_TOTAL,
  SET_GLOBAL_REQUEST_COUNT,
  SET_GLOBAL_REQUEST_TOTAL,
} from "./actions";
import { ToolbarState } from "../../types";
import { Action } from "./types";
import { combineReducers } from "redux";

const initialState: ToolbarState = {
  ipCount: 0,
  ipTotal: 20,
  globalCount: 0,
  globalTotal: 1000,
};

export const ipCount = (
  state = initialState.ipCount,
  { type, payload }: Action
): number => {
  switch (type) {
    case SET_IP_REQUESTS_COUNT:
      return payload;
    default:
      return state;
  }
};

export const ipTotal = (
  state = initialState.ipTotal,
  { type, payload }: Action
): number => {
  switch (type) {
    case SET_IP_REQUESTS_TOTAL:
      return payload;
    default:
      return state;
  }
};

export const globalCount = (
  state = initialState.globalCount,
  { type, payload }: Action
): number => {
  switch (type) {
    case SET_GLOBAL_REQUEST_COUNT:
      return payload;
    default:
      return state;
  }
};

export const globalTotal = (
  state = initialState.globalTotal,
  { type, payload }: Action
): number => {
  switch (type) {
    case SET_GLOBAL_REQUEST_TOTAL:
      return payload;
    default:
      return state;
  }
};

export const toolbar = combineReducers({
  ipCount,
  ipTotal,
  globalCount,
  globalTotal,
});
