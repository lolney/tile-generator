import * as t from "io-ts";
import { right } from "fp-ts/lib/Either";

const GameStringT = t.keyof({
  "Civ V": null,
  "Civ VI": null,
});

export const MapDimensionT = new t.Type(
  "MapDimenionT",
  (u): u is number => typeof u == "number" && u >= 10 && u <= 120,
  (u) => right(u),
  (u) => u
);

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
});
