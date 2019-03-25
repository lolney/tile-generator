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
}

export default new DB();
