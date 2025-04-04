import lodash from "lodash";
import { db } from "../db";
import {
  ApplicationStatus,
  NewCompanyApplication,
  NewEmployeeApplication,
  SelectCompanyApplication,
  SelectEmployeeApplication,
} from "../db/schema";

type ApplicationType = "employee" | "company";
type Application = SelectEmployeeApplication | SelectCompanyApplication;
type NewApplication = Omit<
  NewEmployeeApplication | NewCompanyApplication,
  "id" | "created_at" | "updated_at"
>;

const getTableName = (type: ApplicationType) => `${type}_applications` as const;

export const ApplicationRepository = {
  async create(
    type: ApplicationType,
    application: NewApplication,
  ): Promise<Application> {
    return await db
      .insertInto(getTableName(type))
      .values(application)
      .returningAll()
      .executeTakeFirstOrThrow();
  },

  async update(
    type: ApplicationType,
    id: string,
    status: ApplicationStatus,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    metadata: any,
  ): Promise<Application | undefined> {
    const existingApplication = await db
      .selectFrom(getTableName(type))
      .where("id", "=", id)
      .select("metadata")
      .executeTakeFirst();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updates: any = {
      status,
      updated_at: new Date(),
    };

    if (
      metadata &&
      Object.keys(metadata).length > 0 &&
      !lodash.isEqual(metadata, existingApplication?.metadata)
    ) {
      updates.metadata = metadata;
    }

    return await db
      .updateTable(getTableName(type))
      .set(updates)
      .where("id", "=", id)
      .returningAll()
      .executeTakeFirst();
  },

  async getAll(type?: ApplicationType): Promise<Application[]> {
    if (type) {
      return await db.selectFrom(getTableName(type)).selectAll().execute();
    }

    const [employeeApps, companyApps] = await Promise.all([
      db.selectFrom("employee_applications").selectAll().execute(),
      db.selectFrom("company_applications").selectAll().execute(),
    ]);

    return [...employeeApps, ...companyApps];
  },

  async getByApplicant(
    pkh: string,
    type?: ApplicationType,
  ): Promise<Application[]> {
    if (type) {
      return await db
        .selectFrom(getTableName(type))
        .where("pkh", "=", pkh)
        .selectAll()
        .execute();
    }

    const [employeeApps, companyApps] = await Promise.all([
      db
        .selectFrom("employee_applications")
        .where("pkh", "=", pkh)
        .selectAll()
        .execute(),
      db
        .selectFrom("company_applications")
        .where("pkh", "=", pkh)
        .selectAll()
        .execute(),
    ]);

    return [...employeeApps, ...companyApps];
  },

  async getByIssuer(pkh: string): Promise<Application[]> {
    // registrar placeholder pkh
    if (pkh === "registrar") {
      return await db
        .selectFrom("company_applications")
        .where("issuer_pkh", "=", pkh)
        .selectAll()
        .execute();
    }

    // any other pkh must be of a company and every pkh should only be of one company
    return await db
      .selectFrom("employee_applications")
      .where("issuer_pkh", "=", pkh)
      .selectAll()
      .execute();
  },

  async get(id: string): Promise<Application | undefined> {
    const [employeeApps, companyApps] = await Promise.all([
      db
        .selectFrom("employee_applications")
        .where("id", "=", id)
        .selectAll()
        .execute(),
      db
        .selectFrom("company_applications")
        .where("id", "=", id)
        .selectAll()
        .execute(),
    ]);
    const results = [...employeeApps, ...companyApps];
    return results.length > 0 ? results[0] : undefined;
  },

  async delete(
    type: ApplicationType,
    id: string,
  ): Promise<Application | undefined> {
    return await db
      .deleteFrom(getTableName(type))
      .where("id", "=", id)
      .returningAll()
      .executeTakeFirst();
  },
};
