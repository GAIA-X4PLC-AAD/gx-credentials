import dotenv from "dotenv";
import { Kysely, PostgresDialect } from "kysely";
import { Pool } from "pg";
import { Database } from "../db/schema";
dotenv.config();

export const db = new Kysely<Database>({
  dialect: new PostgresDialect({
    pool: new Pool({
      user: process.env.PG_INITDB_ROOT_USERNAME || "",
      password: process.env.PG_INITDB_ROOT_PASSWORD || "",
      host: process.env.PG_HOST || "localhost",
      database: process.env.PG_DATABASE || "",
      port: parseInt(process.env.PG_PORT || "5432", 10),
    }),
  }),
});
