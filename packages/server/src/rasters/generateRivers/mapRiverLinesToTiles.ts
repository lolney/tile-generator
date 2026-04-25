import { LineString, MultiLineString, Polygon, Position } from "geojson";
import * as turf from "@turf/turf";
import {
  mapRiverToLine,
  RiverType,
  TerrainType,
  Tile,
} from "@tile-generator/common";

const riverEdges: Array<keyof RiverType> = [
  "northEast",
  "northWest",
  "east",
  "west",
  "southEast",
  "southWest",
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

const mapRiverLinesToTiles = (
  tiles: Polygon[],
  riverGeometries: Array<LineString | MultiLineString>,
  waterLayer: Tile[]
): Tile[] => {
  const segments = riverGeometries.flatMap(toLineStrings).flatMap(toSegments);
  if (!segments.length) return tiles.map(() => ({}));

  return tiles.map((tile, index) => {
    if (isWater(waterLayer[index])) return {};

    const tileBbox = turf.bbox(tile) as BBox;
    const candidateSegments = segments.filter(({ bbox }) =>
      overlaps(tileBbox, bbox)
    );
    if (!candidateSegments.length) return {};

    const river = riverEdges.reduce((acc, edge) => {
      const side = mapRiverToLine(tile, edge);
      const [a, b] = side.coordinates;
      const sideBbox = turf.bbox(side) as BBox;
      const intersects = candidateSegments.some(
        ({ a: segmentA, b: segmentB, bbox }) =>
          overlaps(sideBbox, bbox) &&
          segmentsIntersect(a, b, segmentA, segmentB)
      );
      return intersects ? { ...acc, [edge]: true } : acc;
    }, {} as RiverType);

    return Object.keys(river).length ? { river } : {};
  });
};

export default mapRiverLinesToTiles;
