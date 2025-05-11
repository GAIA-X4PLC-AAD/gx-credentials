import dotenv from "dotenv";
import { Kysely, PostgresDialect } from "kysely";
import { fileURLToPath } from "node:url";
import path from "path";
import pg from "pg";
import { Database } from "./schema";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, "../../.env") });

if (
  !process.env.PG_DB_DATABASE ||
  !process.env.PG_DB_ROOT_USERNAME ||
  !process.env.PG_DB_ROOT_PASSWORD
) {
  throw new Error(
    "Missing required database configuration in environment variables."
  );
}

const { Pool } = pg;
const dialect = new PostgresDialect({
  pool: new Pool({
    host: process.env.PG_DB_HOST || "localhost",
    database: process.env.PG_DB_DATABASE || "gx-credentials",
    user: process.env.PG_DB_ROOT_USERNAME || "postgres",
    password: process.env.PG_DB_ROOT_PASSWORD || "postgres",
    port: Number(process.env.DB_PORT) || 5432,
    max: 10,
  }),
});

export const db = new Kysely<Database>({
  dialect,
});
