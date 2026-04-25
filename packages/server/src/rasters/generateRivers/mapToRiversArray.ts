import { sortBy, zip } from "lodash";
import { TilesArray, TileUtils } from "@tile-generator/common";
import { Dimensions, Tile, TerrainType } from "@tile-generator/common";
import { LayerWeightParams, RiverParams } from "../LayerWeightParams";

const MIN_THRESHOLD = 10;

const INCH_IN_MM = 2.5 * 10;
export const BASE_RAINFALL = 40 * INCH_IN_MM;

const rainfallFactor = (rainfall: number) =>
  Math.min(BASE_RAINFALL, rainfall + INCH_IN_MM) / BASE_RAINFALL;

const landFraction = (waterLayer: Tile[]) =>
  waterLayer.map((tile) => !TileUtils.isWater(tile)).length / waterLayer.length;

const scaleThreshold = (tileDiameterMiles: number) => {
  if (tileDiameterMiles <= 2) return 0.1;
  if (tileDiameterMiles <= 5) return 0.25;
  if (tileDiameterMiles <= 10) return 0.5;
  if (tileDiameterMiles <= 25) return 2;
  if (tileDiameterMiles <= 50) return 10;
  if (tileDiameterMiles <= 100) return 25;
  return MIN_THRESHOLD;
};

const mapToTilesArray = (
  rawData: number[],
  waterLayer: Tile[],
  dimensions: Dimensions,
  precipitationLayer: number[],
  layerWeights: LayerWeightParams,
  tileDiameterMiles = 50
) => {
  const sorted = sortBy(rawData);
  const cutoffValue = Math.max(
    sorted[
      Math.floor(
        RiverParams.minRiverPercentile(layerWeights) *
          landFraction(waterLayer) *
          sorted.length
      )
    ],
    scaleThreshold(tileDiameterMiles)
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
