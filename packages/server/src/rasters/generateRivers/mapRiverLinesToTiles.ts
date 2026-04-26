import { LineString, MultiLineString, Polygon, Position } from "geojson";
import * as turf from "@turf/turf";
import {
  Dimensions,
  RiverType,
  TerrainType,
  Tile,
  TilesArray,
} from "@tile-generator/common";
import mapToNodes from "./mapToNodes";
import mapToTiles from "./mapToTiles";
import findRiverSystems from "./findRiverSystems";
import findRiverEndpoints, { findSourceTile } from "./findRiverEndpoints";
import TraceRivers from "./TraceRivers";

const riverEdgeOrder: Array<keyof RiverType> = [
  "northWest",
  "northEast",
  "east",
  "southEast",
  "southWest",
  "west",
];

const toLineStrings = (
  geom: LineString | MultiLineString
): LineString[] => {
  if (geom.type === "LineString") return [geom];
  return geom.coordinates.map((coordinates) => ({
    type: "LineString",
    coordinates,
  }));
};

const isWater = (tile: Tile | undefined) =>
  tile?.terrain === TerrainType.coast || tile?.terrain === TerrainType.ocean;

type BBox = [number, number, number, number];

const overlaps = (a: BBox, b: BBox) =>
  a[0] <= b[2] && a[2] >= b[0] && a[1] <= b[3] && a[3] >= b[1];

type Segment = {
  a: Position;
  b: Position;
  bbox: BBox;
};

const segmentBbox = (a: Position, b: Position): BBox => [
  Math.min(a[0], b[0]),
  Math.min(a[1], b[1]),
  Math.max(a[0], b[0]),
  Math.max(a[1], b[1]),
];

const toSegments = (line: LineString): Segment[] => {
  const segments: Segment[] = [];
  for (let i = 1; i < line.coordinates.length; i++) {
    const a = line.coordinates[i - 1];
    const b = line.coordinates[i];
    segments.push({ a, b, bbox: segmentBbox(a, b) });
  }
  return segments;
};

const orientation = (a: Position, b: Position, c: Position) =>
  (b[1] - a[1]) * (c[0] - b[0]) - (b[0] - a[0]) * (c[1] - b[1]);

const onSegment = (a: Position, b: Position, c: Position) =>
  b[0] <= Math.max(a[0], c[0]) &&
  b[0] >= Math.min(a[0], c[0]) &&
  b[1] <= Math.max(a[1], c[1]) &&
  b[1] >= Math.min(a[1], c[1]);

const segmentsIntersect = (
  a1: Position,
  a2: Position,
  b1: Position,
  b2: Position
) => {
  const o1 = orientation(a1, a2, b1);
  const o2 = orientation(a1, a2, b2);
  const o3 = orientation(b1, b2, a1);
  const o4 = orientation(b1, b2, a2);

  if (o1 * o2 < 0 && o3 * o4 < 0) return true;
  if (o1 === 0 && onSegment(a1, b1, a2)) return true;
  if (o2 === 0 && onSegment(a1, b2, a2)) return true;
  if (o3 === 0 && onSegment(b1, a1, b2)) return true;
  if (o4 === 0 && onSegment(b1, a2, b2)) return true;
  return false;
};

const lineIntersectsTile = (
  tile: Polygon,
  candidateSegments: Segment[]
) => {
  const ring = tile.coordinates[0];
  const tileEdges: Segment[] = [];
  for (let i = 1; i < ring.length; i++) {
    const a = ring[i - 1];
    const b = ring[i];
    tileEdges.push({ a, b, bbox: segmentBbox(a, b) });
  }

  return candidateSegments.some((segment) => {
    const crossesEdge = tileEdges.some(
      (edge) =>
        overlaps(edge.bbox, segment.bbox) &&
        segmentsIntersect(edge.a, edge.b, segment.a, segment.b)
    );
    return (
      crossesEdge ||
      turf.booleanPointInPolygon(segment.a, tile) ||
      turf.booleanPointInPolygon(segment.b, tile)
    );
  });
};

export const mapRiverLinesToMask = (
  tiles: Polygon[],
  riverGeometries: Array<LineString | MultiLineString>,
  waterLayer: Tile[],
  dimensions: Dimensions
): TilesArray<boolean> => {
  const segments = riverGeometries.flatMap(toLineStrings).flatMap(toSegments);
  if (!segments.length)
    return TilesArray.fromDimensions(dimensions.width, dimensions.height, false);

  return new TilesArray(
    tiles.map((tile, index) => {
      if (isWater(waterLayer[index])) return false;

      const tileBbox = turf.bbox(tile) as BBox;
      const candidateSegments = segments.filter(({ bbox }) =>
        overlaps(tileBbox, bbox)
      );
      return lineIntersectsTile(tile, candidateSegments);
    }),
    dimensions.width
  );
};

const mergeRiverTile = (base: Tile, next: Tile) => ({
  ...base,
  ...next,
  river:
    base.river || next.river
      ? {
          ...base.river,
          ...next.river,
        }
      : undefined,
});

const circularDistance = (a: keyof RiverType, b: keyof RiverType) => {
  const distance = Math.abs(riverEdgeOrder.indexOf(a) - riverEdgeOrder.indexOf(b));
  return Math.min(distance, riverEdgeOrder.length - distance);
};

const combinations = <T>(values: T[], count: number): T[][] => {
  if (count === 0) return [[]];
  if (values.length < count) return [];

  const [head, ...tail] = values;
  return [
    ...combinations(tail, count - 1).map((combo) => [head, ...combo]),
    ...combinations(tail, count),
  ];
};

const riverShapeScore = (edges: Array<keyof RiverType>) => {
  let score = 0;
  for (let i = 0; i < edges.length; i++) {
    for (let j = i + 1; j < edges.length; j++) {
      score += circularDistance(edges[i], edges[j]);
    }
  }
  return score;
};

const simplifyRiver = (river: RiverType | undefined): RiverType | undefined => {
  const edges = riverEdgeOrder.filter((edge) => river?.[edge]);
  if (edges.length <= 3) return river;

  const [best] = combinations(edges, 3).sort(
    (a, b) => riverShapeScore(b) - riverShapeScore(a)
  );
  return best.reduce((acc, edge) => ({ ...acc, [edge]: true }), {} as RiverType);
};

const simplifyRiverTiles = (tiles: Tile[]) =>
  tiles.map((tile) => ({ ...tile, river: simplifyRiver(tile.river) }));

const traceMaskToTiles = (
  mask: TilesArray<boolean>,
  waterArray: TilesArray<Tile>,
  output: TilesArray<Tile>
) => {
  for (const system of findRiverSystems(mask)) {
    const graph = mapToNodes(system);
    const endpoints = findRiverEndpoints(system, waterArray);
    const source = findSourceTile(system, waterArray);

    try {
      const network = TraceRivers.perform(graph, source, endpoints);
      if (!network) continue;
      mapToTiles(network).forEach((tile, index) => {
        if (!tile.river) return;
        output.fields[index] = mergeRiverTile(output.fields[index], tile);
      });
    } catch (error) {
      if (process.env.DEBUG_RIVERS === "1") console.error(error);
    }
  }
};

const mapRiverLinesToTiles = (
  tiles: Polygon[],
  riverGeometries: Array<LineString | MultiLineString>,
  waterLayer: Tile[],
  dimensions: Dimensions
): Tile[] => {
  const mask = mapRiverLinesToMask(
    tiles,
    riverGeometries,
    waterLayer,
    dimensions
  );
  const waterArray = new TilesArray(waterLayer, dimensions.width);
  const output = TilesArray.fromDimensions(
    dimensions.width,
    dimensions.height,
    {} as Tile
  );

  traceMaskToTiles(mask, waterArray, output);

  return simplifyRiverTiles(output.fields);
};

export default mapRiverLinesToTiles;
