export interface User {
  pkh: string;
  isRegistrar: boolean;
  companyCredential?: Credential;
}

export interface SessionContextValue {
  user?: User;
  getUser: () => Promise<User | undefined>;
  logout: () => Promise<void>;
}
