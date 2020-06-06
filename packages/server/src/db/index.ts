import { Pool } from "pg";

require("dotenv").config();

export class DB {
  client: Pool;

  constructor() {
    const config = {
      host: `/cloudsql/${process.env.INSTANCE_CONNECTION_NAME}`,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
    };
    const useConfig = Object.values(config).every((e) => e);

    if (useConfig) console.info(`Connecting to host ${config.host}`);
    else {
      const unsetKeys = Object.entries(config)
        .filter(([key, value]) => !value)
        .map(([key, value]) => key);
      console.info(`Unset keys: ${unsetKeys}`);
      console.info(
        `Instance connection name is: ${process.env.INSTANCE_CONNECTION_NAME}`
      );
      console.info(`Connecting to default host`);
    }

    this.client = useConfig ? new Pool(config) : new Pool();
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
      if (res.rows) {
        return res.rows;
      }
      if (res instanceof Array) {
        return res.pop().rows;
      }
    } finally {
      client.release();
    }
  }
}

export default new DB();
