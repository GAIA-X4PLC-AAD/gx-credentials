export interface Company {
  name: string;
  description: string;
  url: string;
  address: string;
  publicKey: string;
}

export interface Employee {
  name: string;
  email: string;
  company: Company;
  address: string;
  publicKey: string;
}
