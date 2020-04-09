import mapToNodes from "./mapToNodes";
import mapToRiversArray from "./mapToRiversArray";
import mapToTiles from "./mapToTiles";
import { Tile, Dimensions } from "../../../common/types";
import findRiverSystems from "./findRiverSystems";
import { isRiverLocal } from "../rasterLocal";
import { Polygon } from "geojson";
import findRiverEndpoints, { findSourceTile } from "./findRiverEndpoints";
import { RiversArray } from "./RiversArray";
import TraceRivers from "./TraceRivers";

const generateRivers = async (
  tiles: Polygon[],
  dimensions: Dimensions,
  waterLayer: Tile[]
): Promise<Tile[][]> => {
  const rawData = await isRiverLocal(tiles);
  const rawRivers = mapToRiversArray(rawData, dimensions);

  const systems = findRiverSystems(rawRivers);

  const tileGroups = systems.map(system => {
    const graph = mapToNodes(system);
    const waterArray = new RiversArray(waterLayer, system.width);
    const endpoints = findRiverEndpoints(system, waterArray);
    const source = findSourceTile(system, waterArray);

    try {
      const network = TraceRivers.perform(graph, source, endpoints);
      console.log("edges", network?.edges());
      if (!network) throw new Error("Empty network");
      const tiles = mapToTiles(network, system);
      return tiles;
    } catch (error) {
      console.log(error);
      return RiversArray.fromDimensions(system.width, system.height, {} as Tile)
        .fields;
    }
  });

  return tileGroups;
};

export default generateRivers;
