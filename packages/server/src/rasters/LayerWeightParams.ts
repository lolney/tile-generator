import { LayerWeights, layerWeightDefaults } from "@tile-generator/common";
import { LC_Type1 } from "../types/rasters";

export class LayerWeightParams {
  weights: Required<LayerWeights>;

  constructor(userWeights?: LayerWeights) {
    this.weights = { ...layerWeightDefaults, ...userWeights };
  }

  get = (layer: keyof Required<LayerWeights>, params = { invert: false }) => {
    let weight = this.weights[layer];
    return params.invert ? 1 - weight : weight;
  };

  apply = (
    layer: keyof Required<LayerWeights>,
    num: number,
    params = { invert: false }
  ) => {
    const weight = this.get(layer, params);
    return weight * num;
  };
}

export class WaterParams {
  /**
   * The number is the percentage of water in the tile.
   * With more water neighbors, we want more land - hence it has to be at least x% water to count as water.
   */
  static waterThresholdByNWaterTilesNeighbors: { [a: number]: number } = {
    0: 0.2,
    1: 0.4,
    2: 0.5,
    3: 0.5,
    4: 0.5,
    5: 0.6,
    6: 0.9,
  };

  static waterThreshold = (params: LayerWeightParams, waterNeighbors: number) =>
    2 *
    params.apply(
      "water",
      WaterParams.waterThresholdByNWaterTilesNeighbors[waterNeighbors],
      { invert: true }
    );
}

export class ElevationParams {
  static landcoverMountainSlopeThreshold = (landcover: number) => {
    switch (landcover) {
      case LC_Type1.Snow:
        return 5;
      case LC_Type1.Barren:
      case LC_Type1.Grasslands:
      case LC_Type1.Savannas:
      case LC_Type1.WoodySavannas:
      case LC_Type1.OpenShrublands:
        return 10;
      default:
        return 13;
    }
  };

  static mountainThreshold = (params: LayerWeightParams, landcover: number) =>
    2 *
    params.apply(
      "elevation",
      ElevationParams.landcoverMountainSlopeThreshold(landcover),
      { invert: true }
    );

  static hillsThreshold = (params: LayerWeightParams) =>
    2 * params.apply("elevation", 4, { invert: true });
}

export class RiverParams {
  static basePercentile = 0.8;

  static minRiverPercentile = (params: LayerWeightParams) =>
    0.8 + (params.get("rivers", { invert: true }) - 0.5) / 2.5;
}
