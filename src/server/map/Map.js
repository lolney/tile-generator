export default class Map {
  constructor(ntiles) {
    this.tiles = new Array(ntiles);

    for (let i = 0; i < this.tiles.length; i++) {
      this.tiles[i] = {};
    }
  }

  addLayer(tiles) {
    this.tiles = this.tiles.map((tile, i) => ({ ...tile, ...tiles[i] }));
  }
}
