import { serializeGeoJSON } from "../../db/postgis";
import { Polygon } from "geojson";
import db from "../../db";
import { RawRiver } from "./types";

const normalizeLinestrings = (rows: any[]): RawRiver[] =>
  rows.map((river: any) => {
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

export async function getRivers(bounds: Polygon | string): Promise<RawRiver[]> {
  if (typeof bounds == "object") {
    bounds = serializeGeoJSON(bounds);
  }

  const query = `select 
        noid as id,
        bas_id as "basinId",
        nuoid as "upstreamId",
        ndoid as "downstreamId",
        ST_AsGeoJSON(a.wkb_geometry) as geom
      from "rivers" as a
      where a.bb_vol_tcm > 1 and ST_INTERSECTS(a.wkb_geometry,
          ${bounds}
      ); `;

  const rows = await db.doQuery(query);

  return normalizeLinestrings(rows);
}
