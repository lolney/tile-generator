import { combineReducers } from "redux";
import { settings } from "./modules/settings";
import { map } from "./modules/map";
import { leaflet } from "./modules/leaflet";
import { toolbar } from "./modules/toolbar";
import { State } from "./types";

export const rootReducer = combineReducers<State>({
  settings,
  leaflet,
  mapData: map,
  toolbar,
});

export default rootReducer;
