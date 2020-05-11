import { Tile as TileType, FeatureType, RiverType } from "./types";
import { TerrainType, Elevation } from "./types";

export class TileUtils {
  static isWater = (tile: TileType) =>
    tile.terrain === TerrainType.coast || tile.terrain === TerrainType.ocean;

  static isHilly = (tile: TileType) =>
    tile.elevation !== undefined && tile.elevation !== Elevation.flat;

  static isImpassible = (tile: TileType) =>
    tile.elevation === Elevation.mountain || tile.feature === FeatureType.ice;

  static isSettlable = (tile: TileType) =>
    !TileUtils.isWater(tile) &&
    !TileUtils.isImpassible(tile) &&
    tile.feature !== FeatureType.marsh &&
    tile.feature !== FeatureType.oasis;

  static displayValue = (
    key: keyof TileType,
    value: TileType[keyof TileType]
  ) => {
    switch (key) {
      case "terrain":
        return TerrainType[value as TerrainType];
      case "elevation":
        return Elevation[value as Elevation];
      case "feature":
        return FeatureType[value as FeatureType];
      case "river":
        const river = value as RiverType;
        return (
          "Rivers: " +
          Object.entries(river)
            .filter(([_, value]) => value)
            .map(([key, _]) => `${key}`)
            .join(", ")
        );
    }
  };
}
