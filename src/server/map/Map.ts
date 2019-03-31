import {
  Tile,
  TerrainType,
  Elevation,
  RiverType,
  MapConfigurable
} from "../../common/types";

export default class Map {
  tiles: Array<Tile>;
  configurable: MapConfigurable;

  constructor(tiles: number | Array<Tile>, configurable: MapConfigurable) {
    if (tiles instanceof Array) {
      this.tiles = tiles;
    } else {
      this.tiles = new Array(tiles);
      for (let i = 0; i < this.tiles.length; i++) {
        this.tiles[i] = {};
      }
    }

    this.configurable = configurable;
  }

  getNeighboringIndex(index: number, direction: keyof RiverType) {
    // TODO: move this logic into a separate grid class?
    const { width, height } = this.configurable;
    const col = index % width;
    const row = Math.floor(index / width);

    const horizOffset = row % 2 == 0 ? 0 : 1;

    switch (direction) {
      case "east":
        return this.getIndex(row, col + 1);
      case "west":
        return this.getIndex(row, col - 1);
      case "northEast":
        return this.getIndex(row - 1, col + horizOffset);
      case "southEast":
        return this.getIndex(row + 1, col + horizOffset);
      case "northWest":
        return this.getIndex(row - 1, col - horizOffset);
      case "southWest":
        return this.getIndex(row + 1, col - horizOffset);
    }
  }

  getIndex(row: number, col: number) {
    const { width, height } = this.configurable;

    if (col >= width || col < 0) return undefined;
    if (row >= height || row < 0) return undefined;

    return row * width + col;
  }

  addLayer(tiles: Array<Tile>) {
    this.tiles = this.tiles.map((tile, i) => {
      const result = { ...tile, ...tiles[i] };

      // Remove elevation if it's a water tile
      if (
        result.terrain != undefined &&
        (result.terrain === TerrainType.coast ||
          result.terrain == TerrainType.ocean)
      ) {
        if (
          result.elevation != undefined &&
          result.elevation != Elevation.flat
        ) {
          delete result.elevation;
        }
      }

      return result;
    });
  }
}
