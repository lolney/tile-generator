import ee from "@google/earthengine";

export function createFindMean(mask, band) {
  const findMean = square => {
    var meanDictionary = mask.reduceRegion({
      reducer: ee.Reducer.mean(),
      geometry: square.geometry(),
      scale: 300,
      maxPixels: 1e9
    });

    var mean = meanDictionary.get(band);
    return square.set({
      mean: mean
    });
  };

  return findMean;
}
