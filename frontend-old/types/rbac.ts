export enum Role {
  BASIC = "1",
  COMPANY = "2",
  TRUST_ANCHOR = "3",
}

export interface Permission {
  action: string;
  resource: string;
}
