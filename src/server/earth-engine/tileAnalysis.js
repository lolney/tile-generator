import ee from "@google/earthengine";

/**
 * Should use reducRegions over this unless timing out
 * @param {ee.Image} mask
 * @param {string} band
 */
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

export function reduceRegions(image, grid) {
  return image.reduceRegions({
    reducer: ee.Reducer.mean(),
    collection: grid,
    scale: 500
  });
}
