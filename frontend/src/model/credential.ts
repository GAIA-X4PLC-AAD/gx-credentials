export enum CredentialFormat {
  LD = "LD",
  JWT = "JWT",
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type CredentialData = any;

type CredentialType = "employee" | "company";

type TCredential = {
  id?: string;
  holder_pkh?: string;
  issuer_pkh?: string;
  subject?: string;
  name?: string;
  issuer?: string;
  format?: CredentialFormat;
  revoked?: boolean;
  credential?: CredentialData; // JSONB
  application_id?: string; // UUID
  created_at?: string;
  updated_at?: string;
  offer?: string;
};

type CreateCredential = Pick<
  TCredential,
  | "holder_pkh"
  | "issuer_pkh"
  | "subject"
  | "issuer"
  | "name"
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
