import { sortBy, zip } from "lodash";
import { TilesArray } from "../../../common/TilesArray";
import { Dimensions, Tile, TerrainType } from "../../../common/types";

const MIN_THRESHOLD = 100;

const PERCENTILE = 0.75;

const INCH_IN_MM = 2.5 * 10;
export const BASE_RAINFALL = 40 * INCH_IN_MM;

const rainfallFactor = (rainfall: number) =>
  Math.min(BASE_RAINFALL, rainfall + INCH_IN_MM) / BASE_RAINFALL;

const mapToTilesArray = (
  rawData: number[],
  waterLayer: Tile[],
  dimensions: Dimensions,
  precipitationLayer: number[]
) => {
  const sorted = sortBy(rawData);
  const cutoffValue = Math.max(
    sorted[Math.floor(PERCENTILE * sorted.length)],
    MIN_THRESHOLD
  );

  return new TilesArray(
    (zip(rawData, precipitationLayer) as [number, number][])
      .map(([flow, rainfall]) => flow * rainfallFactor(rainfall))
      .map(
        (value, i) =>
          value > cutoffValue &&
          waterLayer[i]?.terrain !== TerrainType.coast &&
          waterLayer[i]?.terrain !== TerrainType.ocean
      ),
    dimensions.width
  );
};

export default mapToTilesArray;
