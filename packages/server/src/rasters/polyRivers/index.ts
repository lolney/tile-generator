import turf from "@turf/turf";
import { Polygon } from "@turf/turf";
import { Dimensions, createRawHexPositions } from "@tile-generator/common";
import { Condenser } from "./condenseRiverPoints";
import { getPoints } from "./getPoints";
import { getRivers } from "./getRivers";
import { GridGraph } from "./GridGraph";
import { mapGraphToTiles } from "./mapGraphToTiles";
import { Pathfinder } from "./pathfind";

export * from "./getRivers";

export const generatePolyRivers = async (
  bounds: Polygon,
  dimensions: Dimensions
) => {
  const { width, height } = dimensions;
  const [west, south, east, north] = turf.bbox(bounds);

  // extract the river points
  const rawRivers = await getRivers(bounds);
  // get all the grid points
  const { endpointIds, points, nextPoints } = getPoints(rawRivers);
  // generate the raw grid
  const gridPoints = createRawHexPositions({
    width,
    height,
    lon_start: west,
    lon_end: east,
    lat_start: north,
    lat_end: south,
  });
  // map to the grid and condense them, also creating the graph in the process
  const nextNodes = Condenser.condense(
    points,
    nextPoints,
    gridPoints,
    endpointIds
  );
  const graph = GridGraph.build(dimensions);
  // pathfind between adjacent nodes
  const mappedPaths = Pathfinder.pathfind(graph, nextNodes); // todo
  // map the graph to tiles
  const tiles = mapGraphToTiles(graph); // todo

  return tiles;
};
