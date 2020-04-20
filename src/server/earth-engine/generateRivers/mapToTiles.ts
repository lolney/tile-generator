import { Tile, RiverType } from "../../../common/types";
import { TilesArray } from "../../../common/TilesArray";
import { tileIndexFromEdge } from "./riverNode";
import RiverNodes from "./RiverNodes";

const mapToTiles = (riverTree: RiverNodes): Tile[] => {
  const tiles: TilesArray<Tile> = TilesArray.fromDimensions(
    riverTree.width,
    riverTree.height,
    {}
  );

  for (const { v, w } of riverTree.graph.edges()) {
    const [row, col, string] = tileIndexFromEdge([v, w]);
    const { river } = tiles.get(row, col);

    const newRiver: RiverType = { ...river, [string]: true };
    tiles.set(row, col, { river: newRiver });
  }

  return tiles.fields;
};

export default mapToTiles;
