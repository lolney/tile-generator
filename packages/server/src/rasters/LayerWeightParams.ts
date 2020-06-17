import { LayerWeights } from "@tile-generator/common";
import { LC_Type1 } from "../types/rasters";

type Full<T> = {
  [P in keyof T]-?: T[P];
};

const defaults: Full<LayerWeights> = {
  elevation: 0.5,
  forest: 0.75,
  marsh: 0.25,
  rivers: 0.75,
  water: 0.5,
};

export class LayerWeightParams {
  weights: Full<LayerWeights>;

  constructor(userWeights?: LayerWeights) {
    this.weights = { ...defaults, ...userWeights };
  }

  apply = (weight: keyof Full<LayerWeights>, num: number) =>
    this.weights[weight] * num;
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
    params.apply(
      "water",
      WaterParams.waterThresholdByNWaterTilesNeighbors[waterNeighbors]
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
      ElevationParams.landcoverMountainSlopeThreshold(landcover)
    );

  static hillsThreshold = (params: LayerWeightParams) =>
    2 * params.apply("elevation", 4);
}
