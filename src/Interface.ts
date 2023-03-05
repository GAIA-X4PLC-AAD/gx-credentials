export interface Company {
  name: string;
  description: string;
  gxId: string;
  address: string;
  publicKey: string;
}

export interface Employee {
  name: string;
  company: Company;
  address: string;
  publicKey: string;
}
