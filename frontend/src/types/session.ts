export interface CredentialEntry {
  id: string; // UUID
  holder_pkh: string;
  issuer_pkh: string;
  subject: string;
  issuer: string;
  name: string;
  format: string;
  revoked: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  credential: any; // JSON
  application_id: string; // UUID
  created_at: Date;
  updated_at: Date;
  offer: string;
}

export interface User {
  pkh: string;
  isRegistrar: boolean;
  companyCredential?: CredentialEntry;
}

export interface SessionContextValue {
  user?: User;
  status: "loading" | "authenticated" | "unauthenticated";
  getUser: () => Promise<User | undefined>;
  logout: () => Promise<void>;
}
