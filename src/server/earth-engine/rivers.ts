import { Polygon, MultiLineString, LineString } from "geojson";
import { Tile, RiverType } from "../../common/types";
import db from "../db";
import randomstring from "randomstring";
import _ from "lodash";
import "core-js/features/array/flat";
import { type } from "os";
import { serializeGeoJSON } from "../db/postgis";

/**
 * Algorithm:
 * - Find all rivers within the map's bounding box
 * - (maybe prune them at this stage)
 * - For each river, find intersecting tiles
 *      - Serialize Geojson with this? https://www.npmjs.com/package/bookshelf-geojson
 * - Translate these tiles into a list respresenting the course of the river
 *      - This part is difficult
 *      - Also have to consider that rivers are broken into segments
 * - Go from start to finish by traversing the edges of each hex (either clock- or counterclockwise)
 * - Translate these to river positions on the hex
 */

export type River = {
  name: string;
  geom: LineString;
};

type IndexedPolygon = {
  id: number;
  geometry: Polygon;
  rivers: River[];
};

type IndexedTile = {
  id: number;
  tile: Tile;
};

type Coords = [number, number];

type index = number;

/**
 * Create the river tiles for the map bounded by `bounds`
 * @param bounds
 * @param tiles
 */
export default async function createRiverTiles(
  bounds: Polygon | string,
  tiles: Polygon[]
): Promise<IndexedTile[]> {
  //
  const rivers = await getRivers(bounds);
  let indexedTiles: IndexedTile[] = [];

  for (const river of rivers) {
    const riverTiles = await getTiles(river, tiles);
    console.log(`River ${river.name} has tiles: ${riverTiles.map(t => t.id)}`);
    const edges = await getEdges(riverTiles);
    indexedTiles = indexedTiles.concat(edges);
  }

  return indexedTiles;
}

/**
 * Stage 1: Find all rivers with the bounding box
 * @param bounds
 */
export async function getRivers(bounds: Polygon | string): Promise<River[]> {
  if (typeof bounds == "object") {
    bounds = serializeGeoJSON(bounds);
  }

  const query = `select a.name, ST_AsGeoJSON(a.geom) as geom
    from "rivers_merge" as a
    where ST_WITHIN(a.geom,
        ${bounds}
    ); `;

  const rows = await db.doQuery(query);

  return rows.map(river => {
    const geom = JSON.parse(river.geom);
    geom.coordinates = geom.coordinates
      .map((coords: number[] | number[][]) => {
        if (typeof coords[0] === "number") return [coords];
        if (typeof (<number[][]>coords)[0][0] === "number") {
          return coords;
        } else {
          throw new Error(`Coords is unexpected type: ${coords}`);
        }
      })
      .flat(1);
    return { ...river, geom };
  });
}

/**
 * Stage 2: Map the rivers to tiles
 * @param river
 * @param tiles
 */
export async function getTiles(
  river: River,
  tiles: Polygon[]
): Promise<IndexedPolygon[]> {
  const selectedTiles: IndexedPolygon[] = [];

  // insert geom into a new table
  // TODO: only do this once per batch
  const tableName = "tiles_" + randomstring.generate(10);
  const query = `
   CREATE TABLE ${tableName}
   (
       id integer,
       geom geometry(Polygon,4326)
   );
  `;

  try {
    await db.doQuery(query);

    // Insert tiles into new  table
    await Promise.all(
      tiles.map(async (tile, i) => {
        const serializedTile = JSON.stringify({
          ...tile,
          crs: { type: "name", properties: { name: "EPSG:4326" } }
        });
        const query = `
            INSERT INTO ${tableName} VALUES
            (
                ${i},
                ST_GeomFromGeoJSON('${serializedTile}')
            );
        `;
        await db.doQuery(query);
      })
    );

    // query each element of the line segment
    for (const coords of river.geom.coordinates) {
      const [lng, lat] = coords;

      const query = `
        SELECT id, ST_AsGeoJSON(geom) as geometry
        FROM ${tableName}
        WHERE
        ST_Contains(
            ${tableName}.geom,
            ST_GeomFromText(
            'Point(${lng} ${lat})', 4326
            )
        );
    `;

      const rows = await db.doQuery(query);
      const intersects = rows[0];

      if (intersects !== undefined) {
        const polygon: IndexedPolygon = {
          id: intersects.id,
          geometry: JSON.parse(intersects.geometry),
          rivers: [river]
        };

        // console.log(`found river ${river.name} for polygon ${polygon.id}`);

        if (selectedTiles.length == 0) selectedTiles.push(polygon);
        else {
          const last = selectedTiles[selectedTiles.length - 1];
          if (polygon.id !== last.id) {
            // when encountering a new polygon A:
            // if it's a neighbor of the prev, add A to list
            // else, add all tiles between the two first, then add A
            const intersection = polyIntersection(
              polygon.geometry,
              last.geometry
            );

            if (intersection.length === 2) selectedTiles.push(polygon);
            else
              console.log(
                `Found 2 polygons that aren't adjacent: (${last.id}, ${polygon.id}), ${intersection.length}`
              );
          }
        }
      }
    }

    // could do binary search, but segment length is small
    return selectedTiles;
    //
  } finally {
    const query = `DROP TABLE ${tableName}`;
    await db.doQuery(query);
  }
}

/**
 * Stage 3: Map the rivers to edges of the tiles
 */
export async function getEdges(
  tiles: IndexedPolygon[]
): Promise<IndexedTile[]> {
  // denote tiles t_i, t_i+1, t_i+2 as a, b, c
  // a, b and b, c share two nodes each

  // have: node1, starting node btw a and b (index 5 in b)

  // can choose node2 or node3, nodes shared btw b and c
  // (index 1,2 in b; 5,4 in c)
  // -1 -1 = -2, 5 - 2 = 3
  // therefore, choose 1 (5 in c)
  // mark 5,0, 0,1 as rivers
  const out: IndexedTile[] = [];

  let node = 0;

  for (let i = 0; i < tiles.length - 1; i++) {
    const a = tiles[i];
    const b = tiles[i + 1];

    const intersection = <Coords>polyIntersection(b.geometry, a.geometry);

    if (intersection.length != 2)
      throw new Error(
        `Polygons don't intersect twice, but ${intersection.length}x: ${a.id}, ${b.id}`
      );

    const { tile, nextNode } = chooseEdges(node, intersection, a, b.geometry);
    node = nextNode;
    out.push(tile);
  }

  const last = tiles[tiles.length - 1];
  if (last) {
    out.push(await mapRiversToEdges(last, node));
  }

  return out;
}

/**
 * Consider all the river coords determined to be in IndexedPoly.
 * Mapping these points to the closest nodes of the poly,
 * find the node with a river close to it that's furthest from the start.
 * Draw a river between these points.
 * @param indexedPoly
 * @param node
 */
async function mapRiversToEdges(
  indexedPoly: IndexedPolygon,
  node: number
): Promise<IndexedTile> {
  const getRiverCoords = function*() {
    for (const river of indexedPoly.rivers) {
      console.log(`River: ${river.name}, Polys: ${indexedPoly.id}`);
      for (const coords of river.geom.coordinates) {
        let c = <Coords>coords;
        yield c;
      }
    }
  };

  const river = await _mapRiversToEdges(
    indexedPoly.geometry,
    getRiverCoords(),
    node
  );
  return { id: indexedPoly.id, tile: { river } };
}

export async function _mapRiversToEdges(
  poly: Polygon,
  coordsList: Iterable<Coords>,
  node: number
): Promise<RiverType> {
  let furthest = node;
  let greatestDistance = 0;

  for (const coords of coordsList) {
    const nextNode = await findClosestNode(poly, coords);
    const distance = Math.min(
      diffGoingBack(node, nextNode),
      diffGoingForward(node, nextNode)
    );
    if (distance >= greatestDistance) {
      greatestDistance = distance;
      furthest = nextNode;
    }
  }

  const river = createRiver(node, furthest);
  return river;
}

/**
 * Find the node of `poly` that's closest to `coords`
 */
export async function findClosestNode(
  poly: Polygon,
  coords: Coords
): Promise<number> {
  const pointFromText = ([lng, lat]: Coords) =>
    `ST_GeomFromText( 
        'Point(${lng} ${lat})', 4326 
      )::geometry`;

  const pointFromCoords = (coords: Coords, i: number) => ({
    type: "Point",
    properties: {
      id: i
    },
    coordinates: coords
  });

  const polyPoints = poly.coordinates[0]
    .map((coords, i) => pointFromCoords(<Coords>coords, i))
    .slice(0, -1);

  const geometryCollection = {
    type: "GeometryCollection",
    geometries: polyPoints,
    crs: { type: "name", properties: { name: "EPSG:4326" } }
  };

  const subquery = `SELECT * FROM ST_Dump(ST_GeomFromGeoJSON('${JSON.stringify(
    geometryCollection
  )}'))`;

  const query = `
    SELECT temp.path
    FROM (${subquery}) as temp
    ORDER BY ST_Distance(${pointFromText(coords)}, temp.geom) ASC
    LIMIT 1;
  `;

  const result = await db.doQuery(query);
  return result[0].path[0] - 1;
}

// Add a cushion for floating point errors
const truncate = (a: number) => Math.floor(a * 2 ** 10) / 2 ** 10;
const truncateCoords = (coords: number[]) =>
  coords.map(coord => truncate(coord));

/**
 * Finds the indexes in the coordinate array of b that intersect with a
 * @param a
 * @param b
 */
export function polyIntersection(a: Polygon, b: Polygon) {
  const getKeys = (geom: Polygon) =>
    geom.coordinates[0]
      .slice(0, -1) // last elem of polygon is the same as the first
      .map(truncateCoords)
      .map(coords => coords.toString());
  const coordsA = new Set(getKeys(a));
  const coordsB = getKeys(b);

  const intersection: Number[] = [];
  coordsB.forEach((b_i, i) => {
    if (coordsA.has(b_i)) intersection.push(i);
  });

  return intersection;
}

const N_NODES = 6;

function chooseEdges(
  prevNode: number,
  nextSharedNodes: Coords,
  tile: IndexedPolygon,
  nextTile: Polygon
): { tile: IndexedTile; nextNode: number } {
  //
  const myNextNode = determineEndNode(prevNode, nextSharedNodes);

  // match the node in the current tile with the next
  const nextCoords = tile.geometry.coordinates[0][myNextNode];
  const nextNode = nextTile.coordinates[0].findIndex(val =>
    _.isEqual(truncateCoords(nextCoords), truncateCoords(val))
  );

  const river = createRiver(prevNode, myNextNode);

  return { nextNode, tile: { id: tile.id, tile: { river } } };
}

/**
 * Choose which of the `nextSharedNodes` is closest to `prevNode`
 * @param prevNode
 * @param nextSharedNodes
 */
export function determineEndNode(prevNode: number, nextSharedNodes: Coords) {
  const prevNodeNeg = prevNode - N_NODES;
  const [a, b] = nextSharedNodes;

  const diffA = Math.min(prevNodeNeg - a, prevNode - a);
  const diffB = Math.min(prevNodeNeg - b, prevNode - b);

  const myNextNode = diffA < diffB ? a : b;

  return myNextNode;
}

/**
 * Create a river starting from `prevNode` and ending with `endNode`
 * @param prevNode
 * @param myNextNode
 */
function createRiver(prevNode: number, myNextNode: number): RiverType {
  let i = prevNode;
  const river: RiverType = {};
  let delta =
    diffGoingBack(prevNode, myNextNode) < diffGoingForward(prevNode, myNextNode)
      ? -1
      : 1;

  while (i != myNextNode) {
    let i_next = (i + delta) % N_NODES;
    if (i_next < 0) i_next += N_NODES;

    const pair: Coords = [i, i_next];
    const side = getEdge(pair);
    // @ts-ignore
    river[side] = true;

    i = i_next;
  }

  return river;
}

function getEdge(pair: Coords): string {
  const sorted = pair.sort();

  if (_.isEqual(sorted, [0, 1])) return "northWest";
  if (_.isEqual(sorted, [1, 2])) return "northEast";
  if (_.isEqual(sorted, [2, 3])) return "east";
  if (_.isEqual(sorted, [3, 4])) return "southEast";
  if (_.isEqual(sorted, [4, 5])) return "southWest";
  if (_.isEqual(sorted, [0, 5])) return "west";
  else throw new Error(`Unexpected edge ${sorted}`);
}

function diffGoingBack(a: number, b: number) {
  if (a > b) return a - b;
  else return a - (b - N_NODES);
}

function diffGoingForward(a: number, b: number) {
  if (a > b) return b - (a - N_NODES);
  else return b - a;
}
