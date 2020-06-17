import * as t from "io-ts";
import { right, left } from "fp-ts/lib/Either";

const GameStringT = t.keyof({
  "Civ V": null,
  "Civ VI": null,
});

export const MapDimensionT = new t.Type(
  "MapDimenionT",
  (u): u is number => typeof u == "number" && u >= 10 && u <= 120 && u % 2 == 0,
  (u, e) =>
    typeof u == "number" ? right(u) : left([t.getValidationError(u, e)]),
  (u) => u
);

export const ProportionT = new t.Type(
  "ProportionT",
  (u): u is number => typeof u == "number" && u >= 0 && u <= 1,
  (u, e) =>
    typeof u == "number" ? right(u) : left([t.getValidationError(u, e)]),
  (u) => u
);

export const LayerWeightsT = t.type({
  elevation: t.union([ProportionT, t.undefined]),
  forest: t.union([ProportionT, t.undefined]),
  marsh: t.union([ProportionT, t.undefined]),
  rivers: t.union([ProportionT, t.undefined]),
  water: t.union([ProportionT, t.undefined]),
});

export const DimensionsT = t.type({
  width: MapDimensionT,
  height: MapDimensionT,
});

export const LatLngBoundsT = t.type({
  _southWest: t.type({ lat: t.number, lng: t.number }),
  _northEast: t.type({ lat: t.number, lng: t.number }),
});

export const MapOptionsT = t.type({
  dimensions: DimensionsT,
  format: GameStringT,
  bounds: LatLngBoundsT,
  layerWeights: t.union([LayerWeightsT, t.undefined]),
});
