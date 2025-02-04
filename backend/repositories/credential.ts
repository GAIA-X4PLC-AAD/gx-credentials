import { db } from "../db";
import {
  NewCompanyCredential,
  NewEmployeeCredential,
  SelectCompanyCredential,
  SelectEmployeeCredential,
} from "../db/schema";

export const CredentialRepository = {
  // Employee Credentials
  async createEmployeeCredential(
    credential: Omit<NewEmployeeCredential, "created_at" | "updated_at">
  ): Promise<SelectEmployeeCredential> {
    return await db
      .insertInto("employee_credentials")
      .values(credential)
      .returningAll()
      .executeTakeFirstOrThrow();
  },

  async updateEmployeeCredential(
    holder_pkh: string,
    credential: Partial<NewEmployeeCredential>
  ): Promise<SelectEmployeeCredential | undefined> {
    return await db
      .updateTable("employee_credentials")
      .set({
        ...credential,
        updated_at: new Date(),
      })
      .where("holder_pkh", "=", holder_pkh)
      .returningAll()
      .executeTakeFirst();
  },

  async getAllEmployeeCredentials(): Promise<SelectEmployeeCredential[]> {
    return await db.selectFrom("employee_credentials").selectAll().execute();
  },

  async getEmployeeCredential(
    holder_pkh: string
  ): Promise<SelectEmployeeCredential | undefined> {
    return await db
      .selectFrom("employee_credentials")
      .where("holder_pkh", "=", holder_pkh)
      .selectAll()
      .executeTakeFirst();
  },

  async deleteEmployeeCredential(
    holder_pkh: string
  ): Promise<SelectEmployeeCredential | undefined> {
    return await db
      .deleteFrom("employee_credentials")
      .where("holder_pkh", "=", holder_pkh)
      .returningAll()
      .executeTakeFirst();
  },

  // Company Credentials
  async createCompanyCredential(
    credential: Omit<NewCompanyCredential, "created_at" | "updated_at">
  ): Promise<SelectCompanyCredential> {
    return await db
      .insertInto("company_credentials")
      .values(credential)
      .returningAll()
      .executeTakeFirstOrThrow();
  },

  async updateCompanyCredential(
    holder_pkh: string,
    credential: Partial<NewCompanyCredential>
  ): Promise<SelectCompanyCredential | undefined> {
    return await db
      .updateTable("company_credentials")
      .set({
        ...credential,
        updated_at: new Date(),
      })
      .where("holder_pkh", "=", holder_pkh)
      .returningAll()
      .executeTakeFirst();
  },

  async deleteCompanyCredential(
    holder_pkh: string
  ): Promise<SelectCompanyCredential | undefined> {
    return await db
      .deleteFrom("company_credentials")
      .where("holder_pkh", "=", holder_pkh)
      .returningAll()
      .executeTakeFirst();
  },

  async getAllCompanyCredentials(): Promise<SelectCompanyCredential[]> {
    return await db.selectFrom("company_credentials").selectAll().execute();
  },

  async getCompanyCredential(
    holder_pkh: string
  ): Promise<SelectCompanyCredential | undefined> {
    return await db
      .selectFrom("company_credentials")
      .where("holder_pkh", "=", holder_pkh)
      .selectAll()
      .executeTakeFirst();
  },
};
