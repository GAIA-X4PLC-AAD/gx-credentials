enum ApplicationStatus {
  Open = "open",
  Rejected = "rejected",
  Accepted = "accepted",
}

type ApplicationType = "employee" | "company";

type ApplicationMetadata = {
  [key: string]: string | number | boolean | object;
};

type Application = {
  issuer: string | undefined;
  id?: string;
  pkh?: string;
  status: ApplicationStatus;
  metadata?: ApplicationMetadata; // JSON
  created_at?: string;
  updated_at?: string;
};

type CreateApplication = Pick<Application, "pkh" | "metadata"> & {
  type: ApplicationType;
};

export {
  ApplicationStatus,
  type Application,
  type ApplicationMetadata,
  type ApplicationType,
  type CreateApplication,
};
