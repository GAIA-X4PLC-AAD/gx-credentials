import { db } from "../db";
import {
  NewCompanyCredential,
  NewEmployeeCredential,
  SelectCompanyCredential,
  SelectEmployeeCredential,
} from "../db/schema";

type TableName = "employee_credentials" | "company_credentials";
type NewCredential = NewEmployeeCredential | NewCompanyCredential;
type SelectCredential = SelectEmployeeCredential | SelectCompanyCredential;

export const CredentialRepository = {
  async create<T extends NewCredential, R extends SelectCredential>(
    table: TableName,
    credential: Omit<T, "created_at" | "updated_at">
  ): Promise<R> {
    return (await db
      .insertInto(table)
      .values(credential)
      .returningAll()
      .executeTakeFirstOrThrow()) as R;
  },

  async update<T extends NewCredential, R extends SelectCredential>(
    table: TableName,
    id: string,
    credential: Partial<T>
  ): Promise<R | undefined> {
    return (await db
      .updateTable(table)
      .set({
        ...credential,
        updated_at: new Date(),
      })
      .where("id", "=", id)
      .returningAll()
      .executeTakeFirst()) as R | undefined;
  },

  async getAll<R extends SelectCredential>(table: TableName): Promise<R[]> {
    return (await db.selectFrom(table).selectAll().execute()) as R[];
  },

  async getByHolder<R extends SelectCredential>(
    table: TableName,
    holder_pkh: string
  ): Promise<R[] | undefined> {
    return (await db
      .selectFrom(table)
      .where("revoked", "=", false)
      .where("holder_pkh", "=", holder_pkh)
      .selectAll()
      .execute()) as R[] | undefined;
  },

  async get<R extends SelectCredential>(id: string): Promise<R | undefined> {
    const [employeeCred, companyCred] = await Promise.all([
      db
        .selectFrom("employee_credentials")
        .where("revoked", "=", false)
        .where("id", "=", id)
        .selectAll()
        .executeTakeFirst(),
      db
        .selectFrom("company_credentials")
        .where("revoked", "=", false)
        .where("id", "=", id)
        .selectAll()
        .executeTakeFirst(),
    ]);
    return (employeeCred as R) || (companyCred as R) || undefined;
  },

  async delete<R extends SelectCredential>(
    table: TableName,
    id: string
  ): Promise<R | undefined> {
    return (await db
      .deleteFrom(table)
      .where("id", "=", id)
      .returningAll()
      .executeTakeFirst()) as R | undefined;
  },
};
