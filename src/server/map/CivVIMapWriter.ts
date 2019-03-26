import sqlite3 from "sqlite3";
import { resolve } from "url";
import { PlotAttributes } from "./Civ6Map.types.";

export const readDb = async (): Promise<PlotAttributes[]> => {
  const db = new sqlite3.Database(
    "/home/luke/Projects/tile-generator/tile-generator/EarthStandard.Civ6Map",
    sqlite3.OPEN_READWRITE,
    (err: Error | null) => {
      if (err) {
        console.error(err.message);
      }
      console.log("Connected to the chinook database.");
    }
  );

  const rows: PlotAttributes[] = await new Promise((resolve, reject) => {
    const rows: any[] = [];
    db.each(
      `SELECT * FROM Plots LIMIT 25`,
      (err: Error, row) => {
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

  db.close();
  return rows;
};

export default class CivVIMapWriter {}
