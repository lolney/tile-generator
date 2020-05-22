import { State } from "../../types";

export const reachedGlobalLimit = (state: State) =>
  state.toolbar.globalCount >= state.toolbar.globalTotal;

export const reachedIpLimit = (state: State) =>
  state.toolbar.ipCount >= state.toolbar.ipTotal;

export const reachedLimit = (state: State) =>
  reachedGlobalLimit(state) || reachedIpLimit(state);
