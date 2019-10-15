import mapToNodes from "./mapToNodes";
import findRiverNetwork from "./findRiverNetwork";
import mapToRiversArray from "./mapToRiversArray";
import mapToTiles from "./mapToTiles";
import query from "./query";
import { LatLngBounds, Tile } from "../../../common/types";
import findRiverSystems from "./findRiverSystems";

const generateRivers = (boundingBox: LatLngBounds): Tile[][] => {
  const rawData = query(boundingBox);
  const rawRivers = mapToRiversArray(rawData, boundingBox);

  const systems = findRiverSystems(rawRivers);

  const tileGroups = systems.map(system => {
    const graph = mapToNodes(rawRivers);
    // this is optional. will make sure the river actually flows into a body of water.
    // const withOutlets = findRiverOutlets(graph);
    const network = findRiverNetwork(graph);
    const tiles = mapToTiles(network);

    return tiles;
  });

  return tileGroups;
};

export default generateRivers;
