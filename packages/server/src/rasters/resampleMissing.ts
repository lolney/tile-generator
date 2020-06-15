import { clone } from "lodash";
import { Polygon } from "geojson";
import zip from "lodash/zip";

export const resampleMissing = async (
  tiles: Polygon[],
  samples: number[],
  sample: (tiles: Polygon[]) => Promise<number[]>
) => {
  const holyTiles = zip(tiles, samples).map(([tile, sample]) =>
    sample == null ? tile : undefined
  );
  const tilesToSample = holyTiles.filter((t) => t);
  const resamples = await sample(tilesToSample);

  const filledTiles: number[] = clone(samples);

  for (let i = 0, j = 0; i < samples.length; i++) {
    if (samples[i] == null) {
      filledTiles[i] = resamples[j];
      j++;
    }
  }

  return filledTiles;
};
