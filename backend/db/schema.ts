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
  issuer_pkh: string; // company key or "registrar"
  status: ApplicationStatus;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  metadata: any; // JSONB
  created_at: Generated<Date>;
  updated_at: Generated<Date>;
}

interface BaseCredential {
  id: Generated<string>; // UUID
  holder_pkh: string;
  issuer_pkh: string;
  subject: string;
  issuer: string;
  name: string; // humand-readable name of the subject
  format: CredentialFormat;
  revoked: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  credential: any; // JSONB
  application_id: string; // UUID
  created_at: Generated<Date>;
  updated_at: Generated<Date>;
}

export type EmployeeApplication = BaseApplication;
export type CompanyApplication = BaseApplication;

export type EmployeeCredential = BaseCredential;
export type CompanyCredential = BaseCredential;

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
