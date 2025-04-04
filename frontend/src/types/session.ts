export interface User {
  pkh: string;
  isRegistrar: boolean;
  companyCredential?: Credential;
}

export interface SessionContextValue {
  user?: User;
  status: "loading" | "authenticated" | "unauthenticated";
  getUser: () => Promise<User | undefined>;
  logout: () => Promise<void>;
}
