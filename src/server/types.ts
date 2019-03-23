export interface Tile {
  terrain?: TerrainType;
  elevation?: Elevation;
  feature?: FeatureType;
}

export enum TerrainType {
  grassland,
  plains,
  tundra,
  ice,
  coast,
  ocean
}

export enum FeatureType {
  marsh,
  forest,
  jungle
}

export enum Elevation {
  mountain,
  hill,
  flat
}
