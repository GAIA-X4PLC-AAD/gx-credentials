/*
 * Copyright (C) 2023, Software Engineering for Business Information Systems (sebis) <matthes@tum.de>
 * SPDX-License-Identifier: Apache-2.0
 */
export const ADDRESS_ROLES = {
  COMPANY_APPLIED: "companyApplied",
  COMPANY_APPROVED: "companyApproved",
  COMPANY_REJECTED: "companyRejected",
  EMPLOYEE_APPLIED: "employeeApplied",
  EMPLOYEE_APPROVED: "employeeApproved",
  EMPLOYEE_REJECTED: "employeeRejected",
};

export const APPLICATION_STATUS = {
  PENDING: "pending",
  APPROVED: "approved",
  REJECTED: "rejected",
  REVOKED: "revoked",
};

export const COLLECTIONS = {
  COMPANY_APPLICATIONS: "CompanyApplications",
  EMPLOYEE_APPLICATIONS: "EmployeeApplications",
  TRUSTED_ISSUER_CREDENTIALS: "TrustedIssuerCredentials",
  TRUSTED_EMPLOYEE_CREDENTIALS: "TrustedEmployeeCredentials",
  ADDRESS_ROLES: "AddressRoles",
};
