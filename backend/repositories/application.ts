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

type ApplicationType = "employee" | "company";
type Application = SelectEmployeeApplication | SelectCompanyApplication;
type NewApplication = Omit<
  NewEmployeeApplication | NewCompanyApplication,
  "id" | "created_at" | "updated_at"
>;

const getTableName = (type: ApplicationType) => `${type}_applications` as const;

export const ApplicationRepository = {
  async createApplication(
    type: ApplicationType,
    application: NewApplication
  ): Promise<Application> {
    return await db
      .insertInto(getTableName(type))
      .values(application)
      .returningAll()
      .executeTakeFirstOrThrow();
  },

  async updateApplication(
    type: ApplicationType,
    id: string,
    status: ApplicationStatus,
    metadata: any
  ): Promise<Application | undefined> {
    const existingApplication = await db
      .selectFrom(getTableName(type))
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
      .updateTable(getTableName(type))
      .set(updates)
      .where("id", "=", id)
      .returningAll()
      .executeTakeFirst();
  },

  async getAllApplications(type?: ApplicationType): Promise<Application[]> {
    if (type) {
      return await db.selectFrom(getTableName(type)).selectAll().execute();
    }

    const [employeeApps, companyApps] = await Promise.all([
      db.selectFrom("employee_applications").selectAll().execute(),
      db.selectFrom("company_applications").selectAll().execute(),
    ]);

    return [...employeeApps, ...companyApps];
  },

  async getApplicationsByPkh(
    pkh: string,
    type?: ApplicationType
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

  async deleteApplication(
    type: ApplicationType,
    id: string
  ): Promise<Application | undefined> {
    return await db
      .deleteFrom(getTableName(type))
      .where("id", "=", id)
      .returningAll()
      .executeTakeFirst();
  },

  // Convenience methods
  // createEmployeeApplication: (application: NewApplication) =>
  //   ApplicationRepository.createApplication("employee", application),
  // createCompanyApplication: (application: NewApplication) =>
  //   ApplicationRepository.createApplication("company", application),
  // updateEmployeeApplication: (
  //   id: string,
  //   status: ApplicationStatus,
  //   metadata: any
  // ) =>
  //   ApplicationRepository.updateApplication("employee", id, status, metadata),
  // updateCompanyApplication: (
  //   id: string,
  //   status: ApplicationStatus,
  //   metadata: any
  // ) => ApplicationRepository.updateApplication("company", id, status, metadata),
  // getAllEmployeeApplications: () =>
  //   ApplicationRepository.getAllApplications("employee"),
  // getAllCompanyApplications: () =>
  //   ApplicationRepository.getAllApplications("company"),
  // getEmployeeApplicationByPkh: (pkh: string) =>
  //   ApplicationRepository.getApplicationByPkh("employee", pkh),
  // getCompanyApplicationByPkh: (pkh: string) =>
  //   ApplicationRepository.getApplicationByPkh("company", pkh),
  // deleteEmployeeApplication: (id: string) =>
  //   ApplicationRepository.deleteApplication("employee", id),
  // deleteCompanyApplication: (id: string) =>
  //   ApplicationRepository.deleteApplication("company", id),
};
