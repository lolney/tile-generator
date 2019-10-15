import { RiversArray } from "./types";
import { LatLngBounds } from "../../../common/types";

const mapToRiversArray = (rawdata: Number[], boundingBox: LatLngBounds) => {
  // may have to calc the aspect ratio here, or will we know the width at query time already?
  return new RiversArray(rawdata.map(number => Boolean(number)), 1);
};

export default mapToRiversArray;
