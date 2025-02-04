import * as _ from "lodash";
import { db } from "../db";
import {
  ApplicationStatus,
  NewCompanyApplication,
  NewEmployeeApplication,
  SelectCompanyApplication,
  SelectEmployeeApplication,
} from "../db/schema";
const { isEqual } = _;

export const ApplicationRepository = {
  // Employee Applications
  async createEmployeeApplication(
    application: Omit<
      NewEmployeeApplication,
      "id" | "created_at" | "updated_at"
    >
  ): Promise<SelectEmployeeApplication> {
    return await db
      .insertInto("employee_applications")
      .values(application)
      .returningAll()
      .executeTakeFirstOrThrow();
  },

  async updateEmployeeApplication(
    id: string,
    status: ApplicationStatus,
    metadata: any
  ): Promise<SelectEmployeeApplication | undefined> {
    const existingApplication = await db
      .selectFrom("employee_applications")
      .where("id", "=", id)
      .select("metadata")
      .executeTakeFirst();

    const updates: any = {
      status,
      updated_at: new Date(),
    };

    if (
      metadata &&
      Object.keys(metadata).length > 0 &&
      !isEqual(metadata, existingApplication?.metadata)
    ) {
      updates.metadata = metadata;
    }

    return await db
      .updateTable("employee_applications")
      .set(updates)
      .where("id", "=", id)
      .returningAll()
      .executeTakeFirst();
  },

  async getAllEmployeeApplications(): Promise<SelectEmployeeApplication[]> {
    return await db.selectFrom("employee_applications").selectAll().execute();
  },

  async getEmployeeApplicationByPkh(
    pkh: string
  ): Promise<SelectEmployeeApplication[]> {
    return await db
      .selectFrom("employee_applications")
      .where("pkh", "=", pkh)
      .selectAll()
      .execute();
  },

  async deleteEmployeeApplication(
    id: string
  ): Promise<SelectEmployeeApplication | undefined> {
    const deletedApplication = await db
      .deleteFrom("employee_applications")
      .where("id", "=", id)
      .returningAll()
      .executeTakeFirst();

    return deletedApplication;
  },

  // Company Applications
  async getAllCompanyApplications(): Promise<SelectCompanyApplication[]> {
    return await db.selectFrom("company_applications").selectAll().execute();
  },

  async createCompanyApplication(
    application: Omit<NewCompanyApplication, "id" | "created_at" | "updated_at">
  ): Promise<SelectCompanyApplication> {
    return await db
      .insertInto("company_applications")
      .values(application)
      .returningAll()
      .executeTakeFirstOrThrow();
  },

  async updateCompanyApplication(
    id: string,
    status: ApplicationStatus,
    metadata: any
  ): Promise<SelectCompanyApplication | undefined> {
    const existingApplication = await db
      .selectFrom("company_applications")
      .where("id", "=", id)
      .select("metadata")
      .executeTakeFirst();

    const updates: any = {
      status,
      updated_at: new Date(),
    };

    if (
      metadata &&
      Object.keys(metadata).length > 0 &&
      !isEqual(metadata, existingApplication?.metadata)
    ) {
      updates.metadata = metadata;
    }

    return await db
      .updateTable("company_applications")
      .set(updates)
      .where("id", "=", id)
      .returningAll()
      .executeTakeFirst();
  },

  async getCompanyApplicationByPkh(
    pkh: string
  ): Promise<SelectCompanyApplication[]> {
    return await db
      .selectFrom("company_applications")
      .where("pkh", "=", pkh)
      .selectAll()
      .execute();
  },

  async deleteCompanyApplication(
    id: string
  ): Promise<SelectCompanyApplication | undefined> {
    const deletedApplication = await db
      .deleteFrom("company_applications")
      .where("id", "=", id)
      .returningAll()
      .executeTakeFirst();

    return deletedApplication;
  },
};
