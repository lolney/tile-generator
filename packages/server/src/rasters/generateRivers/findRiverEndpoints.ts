import { maxBy } from "lodash";
import { RawRiverSystem } from "./types";
import { Tile, TerrainType } from "@tile-generator/common";
import { TilesArray } from "@tile-generator/common";

function* findNeighbors<T>(
  base: TilesArray<boolean>,
  overlay: TilesArray<T>,
  condition: (t: T) => boolean
) {
  for (const [i, j] of base.pairs()) {
    if (!base.get(i, j)) continue;
    const count = Array.from(base.neighbors(i, j)).reduce((sum, [ii, jj]) => {
      return condition(overlay.get(ii, jj)) ? sum + 1 : sum;
    }, 0);
    yield { count, index: [i, j] as [number, number] };
  }
}

const findCoastNeighbors = (
  river: RawRiverSystem,
  waterArray: TilesArray<Tile>
) =>
  findNeighbors(
    river,
    waterArray,
    (tile: Tile) => tile.terrain === TerrainType.coast
  );

const findRiverNeighbors = (river: RawRiverSystem) =>
  findNeighbors(river, river, (tile: boolean) => tile);

export const findSourceTile = (
  river: RawRiverSystem,
  water: TilesArray<Tile>
): [number, number] | undefined => {
  const neighborCounts = Array.from(findCoastNeighbors(river, water));
  const maxPair = maxBy(neighborCounts, ({ count, index }) => count);
  return maxPair?.count ? maxPair?.index : undefined;
};

// these need not be the actual endpoints
const findRiverEndpoints = (river: RawRiverSystem, water: TilesArray<Tile>) => {
  const neighborCounts = Array.from(findRiverNeighbors(river));
  // todo: also count adjacent neighbors
  const endpoints = neighborCounts
    .filter(({ count }) => count <= 2)
    .map(({ index }) => index);
  return endpoints;
};

export default findRiverEndpoints;
