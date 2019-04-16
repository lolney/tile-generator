import { combineReducers } from "redux";
import { settings } from "./modules/settings";
import { map } from "./modules/map";
import { leaflet } from "./modules/leaflet";

export default combineReducers({
  settings,
  leaflet,
  map
});
