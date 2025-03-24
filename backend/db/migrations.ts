import { Kysely, sql } from "kysely";
import { db } from "./index";

async function up(db: Kysely<any>): Promise<void> {
  // Create employee_applications table
  await db.schema
    .createTable("employee_applications")
    .addColumn("id", "uuid", (col) =>
      col.primaryKey().defaultTo(sql`gen_random_uuid()`),
    )
    .addColumn("pkh", "varchar", (col) => col.notNull())
    .addColumn("status", "varchar", (col) =>
      col.notNull().check(sql`status IN ('open', 'rejected', 'accepted')`),
    )
    .addColumn("metadata", "jsonb", (col) => col.notNull())
    .addColumn("created_at", "timestamp", (col) =>
      col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull(),
    )
    .addColumn("updated_at", "timestamp", (col) =>
      col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull(),
    )
    .execute();

  // Create company_applications table
  await db.schema
    .createTable("company_applications")
    .addColumn("id", "uuid", (col) =>
      col.primaryKey().defaultTo(sql`gen_random_uuid()`),
    )
    .addColumn("pkh", "varchar", (col) => col.notNull())
    .addColumn("status", "varchar", (col) =>
      col.notNull().check(sql`status IN ('open', 'rejected', 'accepted')`),
    )
    .addColumn("metadata", "jsonb", (col) => col.notNull())
    .addColumn("created_at", "timestamp", (col) =>
      col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull(),
    )
    .addColumn("updated_at", "timestamp", (col) =>
      col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull(),
    )
    .execute();

  // Create employee_credentials table
  await db.schema
    .createTable("employee_credentials")
    .addColumn("id", "uuid", (col) =>
      col.primaryKey().defaultTo(sql`gen_random_uuid()`),
    )
    .addColumn("holder_pkh", "varchar", (col) => col.notNull())
    .addColumn("subject", "varchar", (col) => col.notNull())
    .addColumn("issuer", "varchar", (col) => col.notNull())
    .addColumn("format", "varchar", (col) =>
      col.notNull().check(sql`format IN ('LD', 'JWT')`),
    )
    .addColumn("credential", "jsonb", (col) => col.notNull())
    .addColumn("application_id", "uuid", (col) =>
      col.references("employee_applications.id").onDelete("cascade").notNull(),
    )
    .addColumn("created_at", "timestamp", (col) =>
      col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull(),
    )
    .addColumn("updated_at", "timestamp", (col) =>
      col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull(),
    )
    .execute();

  // Create company_credentials table
  await db.schema
    .createTable("company_credentials")
    .addColumn("id", "uuid", (col) =>
      col.primaryKey().defaultTo(sql`gen_random_uuid()`),
    )
    .addColumn("holder_pkh", "varchar", (col) => col.notNull())
    .addColumn("subject", "varchar", (col) => col.notNull())
    .addColumn("issuer", "varchar", (col) => col.notNull())
    .addColumn("format", "varchar", (col) =>
      col.notNull().check(sql`format IN ('LD', 'JWT')`),
    )
    .addColumn("credential", "jsonb", (col) => col.notNull())
    .addColumn("application_id", "uuid", (col) =>
      col.references("company_applications.id").onDelete("cascade").notNull(),
    )
    .addColumn("created_at", "timestamp", (col) =>
      col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull(),
    )
    .addColumn("updated_at", "timestamp", (col) =>
      col.defaultTo(sql`CURRENT_TIMESTAMP`).notNull(),
    )
    .execute();

  // Create index for employee_credentials and company_credentials application_id columns
  await db.schema
    .createIndex("employee_credentials_application_id_index")
    .on("employee_credentials")
    .column("application_id")
    .execute();

  await db.schema
    .createIndex("company_credentials_application_id_index")
    .on("company_credentials")
    .column("application_id")
    .execute();
}

async function down(db: Kysely<any>): Promise<void> {
  // Drop indexes first to avoid foreign key constraint issues
  await db.schema
    .dropIndex("employee_credentials_application_id_index")
    .execute();
  await db.schema
    .dropIndex("company_credentials_application_id_index")
    .execute();

  // Drop tables in reverse order
  await db.schema.dropTable("company_credentials").execute();
  await db.schema.dropTable("employee_credentials").execute();
  await db.schema.dropTable("company_applications").execute();
  await db.schema.dropTable("employee_applications").execute();
}

export async function createTablesIfNotExist(): Promise<void> {
  const tables = await db.introspection.getTables();
  const tableNames = tables.map((table) => table.name);
  const requiredTables = [
    "employee_applications",
    "company_applications",
    "employee_credentials",
    "company_credentials",
  ];

  const missingTables = requiredTables.filter(
    (table) => !tableNames.includes(table),
  );

  if (missingTables.length > 0) {
    await up(db);
  }
}

export async function dropTables(): Promise<void> {
  await down(db);
}
