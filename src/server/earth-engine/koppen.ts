import { Koppen, FeatureType, TerrainType } from "../../common/types";
import db from "../db";
import { sample } from "../db/postgis";
import { Polygon } from "geojson";
import _ from "lodash";

export function getForestType(koppen: Koppen): FeatureType {
  switch (koppen) {
    case Koppen.Af:
    case Koppen.Am:
    case Koppen.Aw: // mix forest
    case Koppen.As: // mix forest
      return FeatureType.jungle;
    default:
      return FeatureType.forest;
  }
}

export function getTerrainType(koppen: Koppen): TerrainType {
  switch (koppen) {
    case Koppen.Dfc: // might sometimes want grass/plains
    case Koppen.Dfd:
    case Koppen.Dsc: // might sometimes want grass/plains
    case Koppen.Dsd:
    case Koppen.Dwc: // might sometimes want grass/plains
    case Koppen.Dwd:
    case Koppen.ET: // might sometimes want ice
      return TerrainType.tundra;
    case Koppen.Dsa:
    case Koppen.Dsb:
    case Koppen.BSh:
    case Koppen.BSk:
    case Koppen.Csa:
    case Koppen.Csc:
      return TerrainType.plains;
    case Koppen.BWh:
    case Koppen.BWk: // might sometimes want plains
      return TerrainType.desert;
    case Koppen.Af:
    case Koppen.Am:
    case Koppen.Aw:
    case Koppen.As:
    case Koppen.Dfa:
    case Koppen.Dfb:
    case Koppen.Dwa:
    case Koppen.Dwb:
    case Koppen.Csb: // warm summer med; mixed with plains
    case Koppen.Cfa:
    case Koppen.Cfb:
    case Koppen.Cfc:
    case Koppen.Cwa:
    case Koppen.Cwb:
    case Koppen.Cwc:
      return TerrainType.grass;
    case Koppen.EF:
      return TerrainType.ice;
    case Koppen.Ocean:
      return TerrainType.coast;
  }
}

export async function getClimateTypeSampled(geom: Polygon) {
  const query = `
    SELECT * 
    FROM 
      "world_climates_completed_koppen_geiger",
      (${sample(geom, 40)}) as points
    where
      ST_Intersects(
        points.geom,
        world_climates_completed_koppen_geiger.geom  
    );
  `;

  const rows = await db.doQuery(query);
  const climates = rows.map(row => row["climates_f"]);

  return _.sortBy(
    Object.entries(_.countBy(climates)),
    ([key, count]) => count
  ).map(([key, count]) => [dbStringToClimateType(key), count]);
}

export async function getClimateType(lng: number, lat: number) {
  const query = `
    SELECT * FROM "world_climates_completed_koppen_geiger" where
      ST_Intersects(
        ST_GeomFromText(
        'Point(${lng} ${lat})', 4326
        ),
        world_climates_completed_koppen_geiger.geom  
    );
  `;

  // Note on performance:
  // - Takes several seconds for large (eg, 50x50) maps
  // - Most CPU time is spent in native code (~67%) or garbage collection
  // - Roughly 12 connections are opened at once
  const rows = await db.doQuery(query);
  const row = rows[0];
  if (row === undefined) {
    return undefined;
  }

  const str = row["climates_f"];
  const koppen = dbStringToClimateType(str);

  if (koppen === undefined) {
    throw new Error("Unexpected climate type: " + str);
  }

  return koppen;
}

const koppenLookup: Map<string, Koppen> = new Map();

for (const [str, enu] of Object.entries(Koppen)) {
  koppenLookup.set(str.toUpperCase(), enu);
}

function dbStringToClimateType(string: string): Koppen | undefined {
  if (string === null) return Koppen.Ocean;
  return koppenLookup.get(string.toUpperCase());
}
