import { RiversArray } from "./RiversArray";
import { Dimensions } from "../../../common/types";

const threshold = 10;

const mapToRiversArray = (rawdata: Number[], dimensions: Dimensions) => {
  // may have to calc the aspect ratio here, or will we know the width at query time already?
  return new RiversArray(
    rawdata.map(number => number > threshold),
    dimensions.width
  );
};

export default mapToRiversArray;
