import { Polygon, MultiLineString } from "geojson";
import { Tile } from "../../common/types";
import db from "../db";
import randomstring from "randomstring";

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

export async function getRivers(bounds: Polygon): Promise<River[]> {
  const taggedBounds = {
    ...bounds,
    crs: { type: "name", properties: { name: "EPSG:4326" } }
  };
  const query = `select a.name, a.gid, ST_AsGeoJSON(a.geom) as geom
    from "ne_10m_rivers_lake_centerlines_scale_rank" as a
    where ST_WITHIN(a.geom,
        ST_GeomFromGeoJSON('${JSON.stringify(taggedBounds)}')
    ); `;

  const rows = await db.doQuery(query);

  return rows.map(river => ({ ...river, geom: JSON.parse(river.geom) }));
}

function isNeighbor(a: Polygon, b: Polygon) {
  const coordsA = new Set(a.coordinates[0]);
  const coordsB = b.coordinates[0];

  const intersection = coordsB.filter(b_i => coordsA.has(b_i));

  return intersection.length > 0;
}

export async function getTiles(
  river: River,
  tiles: Polygon[]
): Promise<IndexedPolygon[]> {
  const selectedTiles: IndexedPolygon[] = [];

  // insert geom into a new table
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
        selectedTiles.push(polygon);
      }
    }
    // when encountering a new polygon A:
    // if it's a neighbor of the prev, add A to list
    // else, add all tiles between the two first, then add A

    // could do binary search, but segment length is small
    return selectedTiles;
    //
  } finally {
    const query = `DROP TABLE ${tableName}`;
    await db.doQuery(query);
  }
}

export function getEdges(tiles: IndexedPolygon[]): Tile[] {
  // denote tiles t_i, t_i+1, t_i+2 as a, b, c
  // a, b and b, c share nodes A and B, respectively
  // find a path from A to B, marking the respective edges in tile b

  for (let i = 0; i < tiles.length - 1; i++) {
    const a = tiles[i];
    const b = tiles[i + 1];
  }
  return [];
}
