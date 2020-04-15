import { range, sortBy } from "lodash";
import { RiversArray } from "./RiversArray";
import { Dimensions, Tile, TerrainType } from "../../../common/types";

export const threshold = 6000;
export const BASE_DIAMETER_MILES = 1000;
export const BASE_AREA = 3600;

const MIN_THRESHOLD = 100;

const LOW_PERCENTILE = 0.7;
const MID_PERCENTILE = 0.8;
const HIGH_PERCENTILE = 0.95;

const increaseWithDiameter = (diameter: number) =>
  diameter / BASE_DIAMETER_MILES;

const descreaseWithNumberOfTiles = (dimensions: Dimensions) => {
  const area = dimensions.width * dimensions.height;
  return BASE_AREA / area;
};

const mapToRiversArray = (
  rawdata: number[],
  waterLayer: Tile[],
  dimensions: Dimensions,
  diameter: number
) => {
  const adjustedThreshold =
    threshold *
    descreaseWithNumberOfTiles(dimensions) *
    increaseWithDiameter(diameter);

  const indices = sortBy(range(0, rawdata.length), (i: number) => rawdata[i]);

  const [highIndex, midIndex, lowIndex] = [
    HIGH_PERCENTILE,
    MID_PERCENTILE,
    LOW_PERCENTILE,
  ].map((percentile) => Math.floor(percentile * indices.length));

  const [highValue, midValue, lowValue] = [highIndex, midIndex, lowIndex].map(
    (index) => rawdata[indices[index]]
  );

  const params = { adjustedThreshold, highValue, midValue, lowValue };

  let start: number;
  if (midValue > adjustedThreshold * (4 / 3)) {
    start = lowIndex;
    console.log("Including more rivers", params);
  } else if (midValue < adjustedThreshold * (2 / 3)) {
    start = highIndex;
    console.log("Including fewer rivers", params);
  } else {
    start = midIndex;
    console.log("Not adjusting rivers", params);
  }

  const addedIndices = new Set(indices.slice(start));

  return new RiversArray(
    rawdata.map(
      (value, i) =>
        addedIndices.has(i) &&
        value > MIN_THRESHOLD &&
        waterLayer[i]?.terrain !== TerrainType.coast &&
        waterLayer[i]?.terrain !== TerrainType.ocean
    ),
    dimensions.width
  );
};

export default mapToRiversArray;
