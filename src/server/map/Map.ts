import { Tile, TerrainType, Elevation } from "../../common/types";

export default class Map {
  tiles: Array<Tile>;

  constructor(tiles: number | Array<Tile>) {
    if (tiles instanceof Array) {
      this.tiles = tiles;
    } else {
      this.tiles = new Array(tiles);
      for (let i = 0; i < this.tiles.length; i++) {
        this.tiles[i] = {};
      }
    }
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
