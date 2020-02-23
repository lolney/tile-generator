import { maxBy } from "lodash";
import { RawRiverSystem } from "./types";
import { Tile, TerrainType } from "../../../common/types";
import { RiversArray } from "./RiversArray";

function* findNeighbors<T>(
  base: RiversArray<boolean>,
  overlay: RiversArray<T>,
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
  waterArray: RiversArray<Tile>
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
  water: RiversArray<Tile>
): [number, number] | undefined => {
  const neighborCounts = Array.from(findCoastNeighbors(river, water));
  const maxPair = maxBy(neighborCounts, ({ count, index }) => count);
  return maxPair?.count || 0 > 0 ? maxPair?.index : undefined;
};

// these need not be the actual endpoints
const findRiverEndpoints = (
  river: RawRiverSystem,
  water: RiversArray<Tile>
) => {
  const neighborCounts = Array.from(findRiverNeighbors(river));
  // todo: also count adjacent neighbors
  const endpoints = neighborCounts
    .filter(({ count }) => count <= 1)
    .map(({ index }) => index);
  return endpoints;
};

export default findRiverEndpoints;
