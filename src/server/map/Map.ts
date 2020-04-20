import {
  Tile,
  TerrainType,
  Elevation,
  RiverType,
  MapConfigurable,
  FeatureType,
} from "../../common/types";
import zip from "lodash/zip";

export default class Map {
  tiles: Tile[];
  configurable: MapConfigurable;

  constructor(tiles: number | Array<Tile>, configurable: MapConfigurable) {
    this.tiles =
      tiles instanceof Array
        ? tiles
        : new Array(tiles).fill(undefined).map(() => ({}));

    this.configurable = configurable;
  }

  getNeighboringIndex(index: number, direction: keyof RiverType) {
    const { width } = this.configurable;
    const col = index % width;
    const row = Math.floor(index / width);

    const even = row % 2 === 0;

    switch (direction) {
      case "east":
        return this.getIndex(row, col + 1);
      case "west":
        return this.getIndex(row, col - 1);
      case "northEast":
        return this.getIndex(row - 1, col + (even ? 1 : 0));
      case "southEast":
        return this.getIndex(row + 1, col + (even ? 1 : 0));
      case "northWest":
        return this.getIndex(row - 1, col - (even ? 0 : 1));
      case "southWest":
        return this.getIndex(row + 1, col - (even ? 0 : 1));
    }
  }

  remapRivers() {
    this.tiles.forEach((tile, i) => this.remapRiverType(tile, i));
  }

  remapRiverType(plot: Tile, index: number) {
    const riverType = plot.river;
    if (!riverType) return;

    const fields: Array<[keyof RiverType, keyof RiverType]> = [
      ["west", "east"],
      ["northWest", "southEast"],
      ["northEast", "southWest"],
    ];

    for (const [originalDirection, mappedDirection] of fields) {
      if (riverType[originalDirection]) {
        const newIndex = this.getNeighboringIndex(index, originalDirection);
        if (newIndex !== undefined) {
          this.tiles[newIndex].river = {
            ...this.tiles[newIndex].river,
            [mappedDirection]: true,
          };
        }
      }
    }
  }

  getTile(row: number, col: number) {
    const index = this.getIndex(row, col);
    if (index === undefined) return undefined;
    return this.tiles[index];
  }

  getIndex(row: number, col: number) {
    const { width, height } = this.configurable;

    if (col >= width || col < 0) return undefined;
    if (row >= height || row < 0) return undefined;

    return row * width + col;
  }

  static mergeTiles = (tileA: Tile, tileB = {} as Tile) => {
    const isWater = (tile: Tile) =>
      tile.terrain === TerrainType.coast || tile.terrain === TerrainType.ocean;

    const isHilly = (tile: Tile) =>
      tile.elevation !== undefined && tile.elevation !== Elevation.flat;

    const { terrain, ...addition } = tileB;
    const result = { ...tileA, ...addition };

    // prioritize: marsh -> water -> everything else
    if (!isWater(result) && terrain != null) result.terrain = terrain;
    if (result.feature === FeatureType.marsh)
      result.terrain = TerrainType.grass;

    // Remove elevation/features if it's a water tile
    if (isWater(result)) {
      if (isHilly(result)) delete result.elevation;
      if (result.feature) delete result.feature;
    }

    return result;
  };

  static mergeTileArrays = (...tileArrays: Tile[][]) =>
    zip(...tileArrays).map((tiles: Array<Tile | undefined>) =>
      tiles.reduce(
        (accum: Tile, value: Tile | undefined) => Map.mergeTiles(accum, value),
        {}
      )
    );

  addLayer(tiles: Array<Tile>) {
    this.tiles = Map.mergeTileArrays(this.tiles, tiles);
  }
}
