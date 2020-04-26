import { maxBy } from "lodash";
import {
  TerrainType,
  FeatureType,
  Tile,
  RiverType,
} from "../../../common/types";
import { TilesArray } from "../../../common/TilesArray";
import TileUtils from "../../../common/Tile";
import SumMap from "./SumMap";
import { Quadrant, Coords } from "./types";

export default class FertilityMap {
  tiles: TilesArray<Tile>;
  map: TilesArray<number>;
  sumMap: SumMap;

  constructor(tiles: TilesArray<Tile>) {
    this.tiles = tiles;
    this.map = FertilityMap.createMap(tiles);
    this.sumMap = new SumMap(this.map);
  }

  static createMap = (tiles: TilesArray<Tile>) =>
    new TilesArray(
      tiles.fields.map(
        (tile) =>
          FertilityMap.fertilityForFeature(tile.feature) +
          FertilityMap.fertilityForTerrain(tile.terrain) +
          FertilityMap.fertilityForRiver(tile.river)
      ),
      tiles.width
    );

  static fertilityForTerrain = (terrain: TerrainType | undefined) => {
    switch (terrain) {
      case TerrainType.desert:
      case TerrainType.ice:
      case TerrainType.ocean:
        return 0;
      case TerrainType.tundra:
        return 1;
      case TerrainType.plains:
      case TerrainType.coast:
        return 2;
      case TerrainType.grass:
        return 3;
      default:
        return 0;
    }
  };

  static fertilityForFeature = (feature: FeatureType | undefined) => {
    switch (feature) {
      case FeatureType.ice:
      case FeatureType.marsh:
        return -1;
      case FeatureType.jungle:
      case FeatureType.forest:
        return 1;
      case FeatureType.floodplains:
      case FeatureType.oasis:
        return 3;
      default:
        return 0;
    }
  };

  static fertilityForRiver = (river: RiverType | undefined) =>
    river && Object.values(river).filter((val) => val).length > 0 ? 1 : 0;

  startScore = ({ i, j }: Coords) => {
    const buffer = 2;
    if (TileUtils.isWater(this.tiles.get(i, j))) return 0;
    return this.sumMap.sumBetweenValues(
      { i: i - buffer, j: j - buffer },
      { i: i + buffer, j: j + buffer }
    );
  };

  maxScoredTile = ({ start, end }: Quadrant) =>
    maxBy(
      Array.from(
        this.tiles.pairs(Object.values(start), Object.values(end)),
        ([i, j]) => ({ coords: { i, j }, score: this.startScore({ i, j }) })
      ),
      "score"
    );
}
