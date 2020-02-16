import { RiversArray } from "./RiversArray";
import { Dimensions } from "../../../common/types";

const threshold = 150;

const mapToRiversArray = (rawdata: Number[], dimensions: Dimensions) => {
  const meanDimension = (dimensions.width + dimensions.height) / 2;
  const adjustedThreshold = threshold * meanDimension;
  return new RiversArray(
    rawdata.map(number => number > adjustedThreshold),
    dimensions.width
  );
};

export default mapToRiversArray;
