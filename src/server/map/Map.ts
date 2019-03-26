import { Tile } from "../../common/types";

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
    this.tiles = this.tiles.map((tile, i) => ({ ...tile, ...tiles[i] }));
  }
}
