/*
 * Copyright (C) 2023, Software Engineering for Business Information Systems (sebis) <matthes@tum.de>
 * SPDX-License-Identifier: Apache-2.0
 */
export interface CompanyApplication {
  name: string;
  gx_id: string;
  description: string;
  address: string;
  timestamp: string;
  status: string;
  _id?: string;
}

export interface EmployeeApplication {
  name: string;
  employeeId: string;
  companyId: string;
  companyName: string;
  address: string;
  timestamp: string;
  status: string;
  _id?: string;
}
