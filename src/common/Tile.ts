import { Tile as TileType, FeatureType } from "./types";
import { TerrainType, Elevation } from "./types";

export default class Tile {
  static isWater = (tile: TileType) =>
    tile.terrain === TerrainType.coast || tile.terrain === TerrainType.ocean;

  static isHilly = (tile: TileType) =>
    tile.elevation !== undefined && tile.elevation !== Elevation.flat;

  static isImpassible = (tile: TileType) =>
    tile.elevation !== Elevation.mountain && tile.feature !== FeatureType.ice;

  static isSettlable = (tile: TileType) =>
    !Tile.isWater(tile) &&
    !Tile.isImpassible(tile) &&
    tile.feature !== FeatureType.marsh &&
    tile.feature !== FeatureType.oasis;
}
