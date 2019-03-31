import { Polygon, MultiLineString } from "geojson";
import { Tile, RiverType } from "../../common/types";
import db from "../db";
import randomstring from "randomstring";
import _ from "lodash";

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

type River = {
  gid: number;
  name: string;
  geom: MultiLineString;
};

type IndexedPolygon = {
  id: number;
  geometry: Polygon;
};

type IndexedTile = {
  id: number;
  tile: Tile;
};

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

  // TODO: group rivers by name
  for (const river of rivers) {
    const riverTiles = await getTiles(river, tiles);
    const edges = getEdges(riverTiles);
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
    const taggedBounds = {
      ...bounds,
      crs: { type: "name", properties: { name: "EPSG:4326" } }
    };
    bounds = `ST_GeomFromGeoJSON('${JSON.stringify(taggedBounds)}')`;
  }

  const query = `select a.name, a.gid, ST_AsGeoJSON(a.geom) as geom
    from "ne_10m_rivers_lake_centerlines_scale_rank" as a
    where ST_WITHIN(a.geom,
        ${bounds}
    ); `;

  const rows = await db.doQuery(query);

  return rows.map(river => ({ ...river, geom: JSON.parse(river.geom) }));
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
    tiles.forEach(async (tile, i) => {
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
    });

    // query each element of the line segment
    for (const coords of river.geom.coordinates[0]) {
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
          geometry: JSON.parse(intersects.geometry)
        };

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
                `Found 2 polygons that aren't adjacent: (${last.id}, ${
                  polygon.id
                }), ${intersection.length}`
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
export function getEdges(tiles: IndexedPolygon[]): IndexedTile[] {
  // denote tiles t_i, t_i+1, t_i+2 as a, b, c
  // a, b and b, c share two nodes each

  // have: node1, starting node btw a and b (index 5 in b)

  // can choose node2 or node3, nodes shared btw b and c
  // (index 1,2 in b; 5,4 in c)
  // -1 -1 = -2, 5 - 2 = 3
  // therefore, choose 1 (5 in c)
  // mark 5,0, 0,1 as rivers

  // to consider later:
  // ending properly at water bodies
  const out: IndexedTile[] = [];
  let node = 0;

  for (let i = 0; i < tiles.length - 1; i++) {
    const a = tiles[i];
    const b = tiles[i + 1];

    const intersection = <[number, number]>(
      polyIntersection(b.geometry, a.geometry)
    );

    if (intersection.length != 2)
      throw new Error(
        `Polygons don't intersect twice, but ${intersection.length}x: ${
          a.id
        }, ${b.id}`
      );

    const { tile, nextNode } = chooseEdges(node, intersection, a, b.geometry);
    node = nextNode;
    out.push(tile);
  }

  return out;
}

/**
 * Finds the indexes in the coordinate array of b that intersect with a
 * @param a
 * @param b
 */
export function polyIntersection(a: Polygon, b: Polygon) {
  const truncate = (a: number) => Math.floor(a * 10 ** 8) / 10 ** 8;
  const getKeys = (geom: Polygon) =>
    geom.coordinates[0]
      .slice(0, -1)
      .map(coords => coords.map(coord => truncate(coord)))
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
  nextSharedNodes: [number, number],
  tile: IndexedPolygon,
  nextTile: Polygon
): { tile: IndexedTile; nextNode: number } {
  //
  const myNextNode = determineEndNode(prevNode, nextSharedNodes);

  // match the node in the current tile with the next
  const nextCoords = tile.geometry.coordinates[0][myNextNode];
  const nextNode = nextTile.coordinates[0].findIndex(val =>
    _.isEqual(nextCoords, val)
  );

  const river = createRiver(prevNode, myNextNode);

  return { nextNode, tile: { id: tile.id, tile: { river } } };
}

export function determineEndNode(
  prevNode: number,
  nextSharedNodes: [number, number]
) {
  const prevNodeNeg = prevNode - N_NODES;
  const [a, b] = nextSharedNodes;

  const diffA = Math.min(prevNodeNeg - a, prevNode - a);
  const diffB = Math.min(prevNodeNeg - b, prevNode - b);

  const myNextNode = diffA < diffB ? a : b;

  return myNextNode;
}

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

    const pair: [number, number] = [i, i_next];
    const side = getSide(pair);
    // @ts-ignore
    river[side] = true;

    i = i_next;
  }

  return river;
}

function getSide(pair: [number, number]): string {
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
