export interface Company {
  name: string;
  description: string;
  url: string;
}

export interface Employee {
  name: string;
  email: string;
  company: Company;
}
