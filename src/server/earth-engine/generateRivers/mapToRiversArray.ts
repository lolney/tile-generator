import { RiversArray } from "./types";
import { Dimensions } from "../../../common/types";

const mapToRiversArray = (rawdata: Number[], dimensions: Dimensions) => {
  // may have to calc the aspect ratio here, or will we know the width at query time already?
  return new RiversArray(
    rawdata.map(number => Boolean(number)),
    dimensions.width
  );
};

export default mapToRiversArray;
