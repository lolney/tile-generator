import {
  Tile,
  TerrainType,
  Elevation,
  RiverType,
  MapConfigurable
} from "../../common/types";

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

    const even = row % 2 == 0;

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
      ["northEast", "southWest"]
    ];

    for (const [originalDirection, mappedDirection] of fields) {
      if (riverType[originalDirection]) {
        const newIndex = this.getNeighboringIndex(index, originalDirection);
        if (newIndex !== undefined) {
          this.tiles[newIndex].river = {
            ...this.tiles[newIndex].river,
            [mappedDirection]: true
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

  addLayer(tiles: Array<Tile>) {
    this.tiles = this.tiles.map((tile, i) => {
      const addition = tiles[i];
      const result = { ...tile, ...addition };

      const isWater = (tile: Tile) =>
        (result.terrain !== undefined && tile.terrain === TerrainType.coast) ||
        tile.terrain === TerrainType.ocean;

      const isHilly = (tile: Tile) =>
        tile.elevation !== undefined && tile.elevation !== Elevation.flat;

      // Remove elevation if it's a water tile
      if (isWater(result)) {
        if (isHilly(result)) {
          delete result.elevation;
        }
      }

      return result;
    });
  }
}
