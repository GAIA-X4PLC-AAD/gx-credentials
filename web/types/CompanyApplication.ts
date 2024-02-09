/*
 * Copyright (C) 2023, Software Engineering for Business Information Systems (sebis) <matthes@tum.de>
 * SPDX-License-Identifier: Apache-2.0
 */
import { Document } from "mongodb";

export interface CompanyApplication extends Document {
  legalName: string;
  registrationNumber: string;
  headquarterAddress: string;
  legalAddress: string;
  parentOrganization: string;
  subOrganization: string;
  applicationText: string;
  address: string;
  timestamp: string;
  status: string;
}

export interface EmployeeApplication extends Document {
  legalName: string;
  role: string;
  email: string;
  companyAddress: string;
  companyName: string;
  applicationText: string;
  address: string;
  timestamp: string;
  status: string;
}
