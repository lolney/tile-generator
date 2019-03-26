import sqlite3 from "sqlite3";
import { Plots } from "./Civ6Map.types.";
import Civ6Map from "./Civ6Map";
import { Tile } from "../../common/types";
import fs from "fs";

// Tables of interest:
// Plots, PlotRivers, PlotResources, PlotFeatures, PlotCliffs, Players?,
// MetaData, MapAttributes, Map
export default class CivVIMapWriter {
  map: Civ6Map;
  db: sqlite3.Database;

  constructor(map: Civ6Map, path?: string) {
    this.map = map;
    path = path ? path : ":memory:";

    this.db = new sqlite3.Database(
      path,
      sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
      (err: Error | null) => {
        if (err) {
          console.error(err.message);
        }
      }
    );
  }

  async write() {
    const header = this.getMetaDataQuery();
    const body = this.getPlotsQuery();
    var schema = fs.readFileSync(
      "/home/luke/Projects/tile-generator/tile-generator/src/server/map/Civ6MapScheme.sql",
      { encoding: "utf8" }
    );

    const tables = schema.split(";");

    for (const table of tables) {
      if (table != "") await this.run(table + ";");
    }

    await this.run(header);
    await this.run(body);
  }

  async run(query: string) {
    return new Promise((resolve, reject) => {
      const finalCallback = (err: Error | null) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      };

      this.db.run(query, finalCallback);
    });
  }

  getMetaDataQuery() {
    const metadata = this.getNameValueQuery(this.map.metadata);
    const attributes = this.getNameValueQuery(this.map.attributes);

    const row = `(${Object.values(this.map.map).join(",")})`;
    const map = this.getQuery(
      "Map",
      [
        "ID",
        "Width",
        "Height",
        "TopLatitude",
        "BottomLatitude",
        "WrapX",
        "WrapY",
        "MapSizeType"
      ],
      [row]
    );

    return [metadata, attributes, map].join("\n");
  }

  getPlotsQuery() {
    return this.getTileInsertQuery(
      "Plots",
      ["ID", "TerrainType", "ContinentType", "IsImpassable"],
      (tile, i) => `(${i}, '${Civ6Map.getTerrainType(tile)}', '', 0)`
    );
  }

  getNameValueQuery(obj: any) {
    const rows = Object.entries(obj).map(
      ([key, value]) => `('${key}', '${value}')`
    );
    return this.getQuery("MetaData", ["Name", "Value"], rows);
  }

  getTileInsertQuery(
    table: string,
    fields: string[],
    format: (tile: Tile, i: number) => string
  ) {
    const rows = this.map.tiles.map(format);

    return this.getQuery(table, fields, rows);
  }

  getQuery(table: string, fields: string[], rows: string[]) {
    const formattedRows = rows.filter(row => row != "").join(",");
    const formattedFields = fields.map(field => `"${field}"`).join(",");

    const query = `INSERT INTO "${table}" (${formattedFields}) VALUES ${formattedRows};`;
    return query;
  }

  async getPlots(): Promise<Plots[]> {
    const rows: Plots[] = await new Promise((resolve, reject) => {
      const rows: any[] = [];
      this.db.each(
        `SELECT * FROM Plots LIMIT 25`,
        (err: Error, row: Plots) => {
          if (err) {
            console.error(err.message);
            reject(err);
          } else {
            rows.push(row);
          }
        },
        () => resolve(rows)
      );
    });

    return rows;
  }
}
