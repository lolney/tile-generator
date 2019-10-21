import mapToNodes from "./mapToNodes";
import findRiverNetwork from "./findRiverNetwork";
import mapToRiversArray from "./mapToRiversArray";
import mapToTiles from "./mapToTiles";
import { Tile, Dimensions } from "../../../common/types";
import findRiverSystems from "./findRiverSystems";
import { isRiverLocal } from "../rasterLocal";
import { Polygon } from "geojson";

const generateRivers = async (
  tiles: Polygon[],
  dimensions: Dimensions
): Promise<Tile[][]> => {
  const rawData = await isRiverLocal(tiles);
  const rawRivers = mapToRiversArray(rawData, dimensions);

  const systems = findRiverSystems(rawRivers);

  const tileGroups = systems.map(system => {
    const graph = mapToNodes(system);
    // this is optional. will make sure the river actually flows into a body of water.
    // const withOutlets = findRiverOutlets(graph);
    const network = findRiverNetwork(graph);
    const tiles = mapToTiles(network, system);

    return tiles;
  });

  return tileGroups;
};

export default generateRivers;
