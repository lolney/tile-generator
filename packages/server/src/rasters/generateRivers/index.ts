import mapToNodes from "./mapToNodes";
import mapToTilesArray from "./mapToRiversArray";
import mapToTiles from "./mapToTiles";
import { Tile, Dimensions } from "@tile-generator/common";
import findRiverSystems from "./findRiverSystems";
import { isRiverLocal, precipitationLocal } from "../rasterLocal";
import { Polygon } from "geojson";
import * as turf from "@turf/turf";
import { findHydroRiverLines } from "../../db/postgis";
import findRiverEndpoints, { findSourceTile } from "./findRiverEndpoints";
import { TilesArray } from "@tile-generator/common";
import TraceRivers from "./TraceRivers";
import ArrayDebugger from "./debug/ArrayDebugger";
import { LayerWeightParams } from "../LayerWeightParams";
import mapRiverLinesToTiles from "./mapRiverLinesToTiles";

const getTileDiameterMiles = (tile: Polygon) => {
  const ring = tile.coordinates[0];
  const lngs = ring.map(([lng]) => lng);
  const lats = ring.map(([, lat]) => lat);
  const bbox = [
    Math.min(...lngs),
    Math.min(...lats),
    Math.max(...lngs),
    Math.max(...lats),
  ] as [number, number, number, number];

  return turf.length(
    turf.lineString([
      [bbox[0], bbox[1]],
      [bbox[2], bbox[3]],
    ]),
    { units: "miles" }
  );
};

const getBoundsPolygon = (tiles: Polygon[]): Polygon => {
  const coords = tiles.flatMap((tile) => tile.coordinates[0]);
  const lngs = coords.map(([lng]) => lng);
  const lats = coords.map(([, lat]) => lat);
  return turf.bboxPolygon([
    Math.min(...lngs),
    Math.min(...lats),
    Math.max(...lngs),
    Math.max(...lats),
  ]).geometry;
};

const getVectorMinDischarge = (layerWeights: LayerWeightParams) => {
  const envValue = Number(process.env.RIVER_VECTOR_MIN_DISCHARGE_CMS);
  if (!Number.isNaN(envValue) && envValue >= 0) return envValue;

  const riverWeight = layerWeights.get("rivers");
  if (riverWeight <= 0) return Infinity;
  return 0.1 + (1 - riverWeight) * 2;
};

const getVectorMinStrahler = () => {
  const envValue = Number(process.env.RIVER_VECTOR_MIN_STRAHLER);
  return !Number.isNaN(envValue) && envValue >= 1 ? envValue : 1;
};

const generateVectorRivers = async (
  tiles: Polygon[],
  waterLayer: Tile[],
  layerWeights: LayerWeightParams
) => {
  const minDischarge = getVectorMinDischarge(layerWeights);
  if (!Number.isFinite(minDischarge)) return undefined;

  const riverGeometries = await findHydroRiverLines(
    getBoundsPolygon(tiles),
    minDischarge,
    getVectorMinStrahler()
  );
  const riverTiles = mapRiverLinesToTiles(tiles, riverGeometries, waterLayer);
  return riverTiles.some((tile) => tile.river) ? riverTiles : undefined;
};

const generateRivers = async (
  tiles: Polygon[],
  dimensions: Dimensions,
  waterLayer: Tile[],
  layerWeights: LayerWeightParams
): Promise<Tile[][]> => {
  const vectorRivers = await generateVectorRivers(
    tiles,
    waterLayer,
    layerWeights
  );
  if (vectorRivers) return [vectorRivers];

  const rawData = await isRiverLocal(tiles);
  const precipitationLayer = await precipitationLocal(tiles);
  const tileDiameterMiles = getTileDiameterMiles(tiles[0]);
  const rawRivers = mapToTilesArray(
    rawData,
    waterLayer,
    dimensions,
    precipitationLayer,
    layerWeights,
    tileDiameterMiles
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
