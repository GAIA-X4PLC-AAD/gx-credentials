export interface CompanyApplication {
  name: string;
  gx_id: string;
  description: string;
  address: string;
  timestamp: string;
  status: string;
}

export interface EmployeeApplication {
  name: string;
  employeeId: string;
  companyId: string;
  companyName: string;
  address: string;
  timestamp: string;
  status: string;
}
