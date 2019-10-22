import { RiverNodes, RawRiverSystem } from "./types";
import { Tile } from "../../../common/types";
import { RiversArray } from "./RiversArray";
import { tileIndexFromEdge } from "./riverNode";

const mapToTiles = (
  riverTree: RiverNodes,
  riverSystem: RawRiverSystem
): Tile[] => {
  const tiles: RiversArray<Tile> = RiversArray.fromDimensions(
    riverSystem.width,
    riverSystem.height,
    {}
  );

  for (const { v, w } of riverTree.edges()) {
    const [row, col, string] = tileIndexFromEdge([v, w]);
    const { river } = tiles.get(row, col);

    const newRiver = { ...river, [string]: true };
    tiles.set(row, col, newRiver);
  }

  return tiles.fields;
};

export default mapToTiles;
