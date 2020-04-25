import { TerrainType, FeatureType, Tile } from "../../../common/types";
import { TilesArray } from "../../../common/TilesArray";
import SumMap from "./SumMap";

export default class FertilityMap {
  map: TilesArray<number>;
  sumMap: SumMap;

  constructor(tiles: TilesArray<Tile>) {
    this.map = FertilityMap.createMap(tiles);
    this.sumMap = new SumMap(this.map);
  }

  static createMap = (tiles: TilesArray<Tile>) =>
    new TilesArray(
      tiles.fields.map(
        (tile) =>
          FertilityMap.fertilityForFeature(tile.feature) +
          FertilityMap.fertilityForTerrain(tile.terrain)
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
}
