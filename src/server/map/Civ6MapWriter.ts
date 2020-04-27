import sqlite3 from "sqlite3";
import { compact } from "lodash";
import { Plots } from "./Civ6Map.types";
import Civ6Map from "./Civ6Map";
import { Tile } from "../../common/types";
import fs from "fs";
import path from "path";
import Errors from "./Errors";

const TEMPLATE_FILE = path.join(__dirname, "../../../CustomMap.Civ6Map");
const SAVE_DIRECTORY = path.join(__dirname, "../../../maps");

export default class Civ6MapWriter {
  map: Civ6Map;
  db: sqlite3.Database;
  path: string;

  constructor(map: Civ6Map, filename?: string) {
    this.map = map;

    if (filename !== undefined) {
      // Copy template file to save directory
      this.path = path.join(SAVE_DIRECTORY, filename);
      fs.copyFileSync(TEMPLATE_FILE, this.path);
    } else this.path = ":memory:";

    this.db = new sqlite3.Database(
      this.path,
      sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
      (err: Error | null) => {
        if (err) {
          console.error(err.message);
        }
      }
    );
  }

  async write(): Promise<Buffer> {
    await this.writeExistingDb();
    return new Promise((resolve, reject) => {
      fs.readFile(this.path, (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
  }

  /**
   * Populate all required tables
   */
  async createDb() {
    const headers = this.getMetaDataQueries();
    const body = this.getPlotsQueries();
    var schema = fs.readFileSync("./src/server/map/Civ6MapScheme.sql", {
      encoding: "utf8",
    });

    const tables = schema.split(";");

    for (const table of tables) {
      if (table !== "") await this.run(table + ";");
    }

    for (const header of headers) {
      await this.run(header);
    }

    for (const insert of body) {
      await this.run(insert);
    }
  }

  /**
   * Add a set of plots to an existing db
   */
  async writeExistingDb() {
    const errors = new Errors();

    const deletes = [
      "Map",
      "Plots",
      "StartPositions",
      "PlotRivers",
      "PlotResources",
      "PlotFeatures",
      "PlotCliffs",
      "MetaData",
      "ModText",
      "ModDependencies",
    ].map((table) => `DELETE FROM ${table};`);

    const map = this.getQueryFromEntries("Map", [this.map.map]);
    const modText = this.getQueryFromEntries("ModText", this.map.modText);
    const starts = await errors.collect(
      () =>
        this.getQueryFromEntries(
          "StartPositions",
          this.map.getStartPositions()
        ),
      ""
    );
    const body = this.getPlotsQueries();

    for (const del of deletes) {
      await this.run(del);
    }

    await this.run(map);
    await this.run(modText);
    await this.run(starts);

    for (const query of body) {
      await this.run(query);
    }

    return errors;
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

  getMetaDataQueries() {
    const metadata = this.getNameValueQuery("MetaData", this.map.metadata);
    const attributes = this.getNameValueQuery(
      "MapAttributes",
      this.map.attributes
    );

    const map = this.getQueryFromEntries("Map", [this.map.map]);
    const players = this.getQueryFromEntries("Players", this.map.players);
    const modText = this.getQueryFromEntries("ModText", this.map.modText);

    return [metadata, attributes, map, players, modText];
  }

  getQueryFromEntries(table: string, objs: any[]) {
    if (objs.length === 0) return "";

    const format = (obj: any) => {
      if (typeof obj === "string") return `'${obj}'`;
      if (typeof obj === "boolean") return obj ? 1 : 0;
      else return obj;
    };

    const rows = objs.map(
      (obj) => `(${Object.values(obj).map(format).join(",")})`
    );
    const fields = Object.keys(objs[0]);

    return this.getQuery(table, fields, rows);
  }

  getPlotsQueries() {
    const queries = [
      this.getTileInsertQuery(
        "Plots",
        ["ID", "TerrainType", "ContinentType", "IsImpassable"],
        (tile, i) => `(${i}, '${Civ6Map.getTerrainType(tile)}', '', 0)`
      ),
      this.getTileInsertQuery(
        "PlotFeatures",
        ["ID", "FeatureType"],
        (tile, index) => {
          const feature = Civ6Map.getFeatureType(tile);
          return feature ? `(${index}, '${feature}')` : feature;
        }
      ),
      this.getQueryFromEntries("PlotRivers", this.map.getRivers()),
    ].filter((query) => query !== "");

    return queries;
  }

  getNameValueQuery(table: string, obj: any) {
    const rows = Object.entries(obj).map(
      ([key, value]) => `('${key}', '${value}')`
    );
    return this.getQuery(table, ["Name", "Value"], rows);
  }

  getTileInsertQuery(
    table: string,
    fields: string[],
    format: (tile: Tile, i: number) => string | null
  ) {
    const rows = compact(this.map.orderedTiles.map(format));

    return rows.length === 0 ? "" : this.getQuery(table, fields, rows);
  }

  getQuery(table: string, fields: string[], rows: string[]) {
    const formattedRows = rows.filter((row) => row !== "").join(",");
    const formattedFields = fields.map((field) => `"${field}"`).join(",");

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
