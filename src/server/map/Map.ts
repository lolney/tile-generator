import { Tile } from "../types";

export default class Map {
  tiles: Array<Tile>;

  constructor(ntiles: number) {
    this.tiles = new Array(ntiles);

    for (let i = 0; i < this.tiles.length; i++) {
      this.tiles[i] = {};
    }
  }

  addLayer(tiles: Array<Tile>) {
    this.tiles = this.tiles.map((tile, i) => ({ ...tile, ...tiles[i] }));
  }
}
