import { Tile } from "@tile-generator/common";
import { createTooltip } from "../utils";

describe("createTooltip", () => {
  const layers = ([
    [
      {
        river: { northEast: true },
      },
      "Rivers: northEast",
    ],
    [
      {
        river: { northEast: true, southEast: true },
      },
      "Rivers: northEast, southEast",
    ],
    [{}, "None"],
    [
      {
        terrain: 0,
      },
      "grass",
    ],
    [
      {
        terrain: undefined,
      },
      "None",
    ],
    [
      {
        feature: 0,
      },
      "ice",
    ],
    [
      {
        elevation: 0,
      },
      "flat",
    ],
  ] as Array<[Tile, string]>).map(([tile, expected]) => [
    {
      feature: { properties: tile },
    },
    expected,
  ]);

  it.each(layers)("should create %j for %j", (layer, expected) => {
    expect(createTooltip((layer as unknown) as L.Layer)).toEqual(expected);
  });
});
