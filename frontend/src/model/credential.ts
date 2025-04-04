export enum CredentialFormat {
  LD = "LD",
  JWT = "JWT",
}

type CredentialData = {
  [key: string]: string | number | boolean | object;
};

type CredentialType = "employee" | "company";

type TCredential = {
  id?: string;
  holder_pkh?: string;
  issuer_pkh?: string;
  subject?: string;
  issuer?: string;
  format?: CredentialFormat;
  revoked?: boolean;
  credential?: CredentialData; // JSONB
  application_id?: string; // UUID
  created_at?: string;
  updated_at?: string;
};

type CreateCredential = Pick<
  TCredential,
  | "holder_pkh"
  | "subject"
  | "issuer"
  | "format"
  | "credential"
  | "application_id"
> & {
  type: CredentialType;
};

export type {
  CreateCredential,
  CredentialData,
  TCredential as Credential,
  CredentialType,
};
