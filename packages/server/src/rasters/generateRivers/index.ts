import mapToNodes from "./mapToNodes";
import mapToTilesArray from "./mapToRiversArray";
import mapToTiles from "./mapToTiles";
import { Tile, Dimensions } from "@tile-generator/common";
import findRiverSystems from "./findRiverSystems";
import { isRiverLocal, precipitationLocal } from "../rasterLocal";
import { Polygon } from "geojson";
import findRiverEndpoints, { findSourceTile } from "./findRiverEndpoints";
import { TilesArray } from "@tile-generator/common";
import TraceRivers from "./TraceRivers";
import ArrayDebugger from "./debug/ArrayDebugger";

const generateRivers = async (
  tiles: Polygon[],
  dimensions: Dimensions,
  waterLayer: Tile[]
): Promise<Tile[][]> => {
  const rawData = await isRiverLocal(tiles);
  const precipitationLayer = await precipitationLocal(tiles);
  const rawRivers = mapToTilesArray(
    rawData,
    waterLayer,
    dimensions,
    precipitationLayer
  );

  new ArrayDebugger(rawRivers).print("All rivers");
  const systems = findRiverSystems(rawRivers);

  const tileGroups = systems.map((system) => {
    new ArrayDebugger(system).print("River system");

    const graph = mapToNodes(system);
    const waterArray = new TilesArray(waterLayer, system.width);
    const endpoints = findRiverEndpoints(system, waterArray);
    const source = findSourceTile(system, waterArray);

    try {
      const network = TraceRivers.perform(graph, source, endpoints);
      console.debug("edges", network?.graph.edges());
      if (!network) throw new Error("Empty network");
      const tiles = mapToTiles(network);
      return tiles;
    } catch (error) {
      console.error(error);
      return TilesArray.fromDimensions(system.width, system.height, {} as Tile)
        .fields;
    }
  });

  return tileGroups;
};

export default generateRivers;
