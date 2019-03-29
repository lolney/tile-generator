import { Pool } from "pg";

require("dotenv").config();

export class DB {
  client: Pool;

  constructor() {
    this.client = new Pool();
  }

  async connect() {
    return this.client.connect();
  }

  async doQuery(query: string) {
    const client = await this.connect();

    try {
      // Note on performance:
      // - Takes several seconds for large (eg, 50x50) maps
      // - Most CPU time is spent in native code (~67%) or garbage collection
      // - Roughly 12 connections are opened at once
      const res = await client.query(query);
      return res.rows;
    } finally {
      client.release();
    }
  }
}

export default new DB();
