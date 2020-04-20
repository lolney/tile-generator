import {
  receiveGrid,
  submitting,
  finishedMap,
  submitError,
  clearError,
} from "./actions";
import { AnyAction } from "redux";
import { State } from "../../types";
import { ThunkDispatch } from "redux-thunk";

export type Action =
  | ReturnType<typeof receiveGrid>
  | ReturnType<typeof submitting>
  | ReturnType<typeof finishedMap>
  | ReturnType<typeof submitError>
  | ReturnType<typeof clearError>;

export type MapDispatch = ThunkDispatch<State, any, AnyAction>;
