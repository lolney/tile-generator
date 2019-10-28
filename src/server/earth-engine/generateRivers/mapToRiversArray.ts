import { RiversArray } from "./RiversArray";
import { Dimensions } from "../../../common/types";

const threshold = 10;

const mapToRiversArray = (rawdata: Number[], dimensions: Dimensions) => {
  // todo: need to filter according to the size (larger size -> higher threshold)
  return new RiversArray(
    rawdata.map(number => number > threshold),
    dimensions.width
  );
};

export default mapToRiversArray;
