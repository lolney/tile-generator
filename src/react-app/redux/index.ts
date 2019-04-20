import { combineReducers, Reducer, AnyAction } from "redux";
import { settings } from "./modules/settings";
import { map } from "./modules/map";
import { leaflet } from "./modules/leaflet";
import { State } from "./types";

export default combineReducers<State>({
  settings,
  leaflet,
  mapData: map
});
