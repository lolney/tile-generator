import { RiversArray } from "./RiversArray";
import { Dimensions } from "../../../common/types";

const threshold = 3000;
const BASE_DIAMETER_MILES = 1000;
const BASE_DIMENSION = 60;

const increaseWithDiameter = (diameter: number) =>
  diameter / BASE_DIAMETER_MILES;

const descreaseWithNumberOfTiles = (dimensions: Dimensions) => {
  const meanDimension = (dimensions.width + dimensions.height) / 2;
  return BASE_DIMENSION / meanDimension;
};

const mapToRiversArray = (
  rawdata: Number[],
  dimensions: Dimensions,
  diameter: number
) => {
  const adjustedThreshold =
    threshold *
    descreaseWithNumberOfTiles(dimensions) *
    increaseWithDiameter(diameter);

  return new RiversArray(
    rawdata.map((number) => number > adjustedThreshold),
    dimensions.width
  );
};

export default mapToRiversArray;
