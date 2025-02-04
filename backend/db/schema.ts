import { Generated, Insertable, Selectable, Updateable } from "kysely";

export enum ApplicationStatus {
  Open = "open",
  Rejected = "rejected",
  Accepted = "accepted",
}

export enum CredentialFormat {
  LD = "LD",
  JWT = "JWT",
}

interface BaseApplication {
  id: Generated<string>; // UUID
  pkh: string;
  status: ApplicationStatus;
  metadata: any; // JSONB
  created_at: Generated<Date>;
  updated_at: Generated<Date>;
}

interface BaseCredential {
  holder_pkh: string;
  subject: string;
  issuer: string;
  format: CredentialFormat;
  credential: any; // JSONB
  application_id: string; // UUID
  created_at: Generated<Date>;
  updated_at: Generated<Date>;
}

export interface EmployeeApplication extends BaseApplication {}
export interface CompanyApplication extends BaseApplication {}

export interface EmployeeCredential extends BaseCredential {}
export interface CompanyCredential extends BaseCredential {}

export interface Database {
  employee_applications: EmployeeApplication;
  company_applications: CompanyApplication;
  employee_credentials: EmployeeCredential;
  company_credentials: CompanyCredential;
}

// Convenience types for CRUD operations
export type NewEmployeeApplication = Insertable<EmployeeApplication>;
export type NewCompanyApplication = Insertable<CompanyApplication>;

export type NewEmployeeCredential = Insertable<EmployeeCredential>;
export type NewCompanyCredential = Insertable<CompanyCredential>;

export type SelectEmployeeApplication = Selectable<EmployeeApplication>;
export type SelectCompanyApplication = Selectable<CompanyApplication>;

export type SelectEmployeeCredential = Selectable<EmployeeCredential>;
export type SelectCompanyCredential = Selectable<CompanyCredential>;

export type UpdateEmployeeApplication = Updateable<EmployeeApplication>;
export type UpdateCompanyApplication = Updateable<CompanyApplication>;

export type UpdateEmployeeCredential = Updateable<EmployeeCredential>;
export type UpdateCompanyCredential = Updateable<CompanyCredential>;
