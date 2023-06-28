/*
 * Copyright (C) 2023, Software Engineering for Business Information Systems (sebis) <matthes@tum.de>
 * SPDX-License-Identifier: Apache-2.0
 */
import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";
import type { NextApiRequest, NextApiResponse } from "next";
import {
  addCredentialInDb,
  setAddressRoleInDb,
  updateApplicationStatusInDb,
} from "@/lib/database";
import { ADDRESS_ROLES, COLLECTIONS } from "@/constants/constants";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>,
) {
  const session = await getServerSession(req, res, authOptions);
  console.log(session);
  if (session) {
    // Signed in
    try {
      // write credential to db
      if (
        !(await writeTrustedIssuerCredential(
          req.body.credential,
          req.body.role,
        ))
      )
        res.status(500);
      // update application for that credential on db
      if (
        !(await updateApplicationStatus(req.body.applicationKey, req.body.role))
      )
        res.status(500);
      res.status(200);
    } catch (e) {
      res.status(500);
    }
  } else {
    // Not Signed in
    res.status(401);
  }
  res.end();
}

const writeTrustedIssuerCredential = async (credential: any, role: string) => {
  try {
    let collection = "",
      addressRoleStatus = "";
    switch (role) {
      case "company":
        collection = COLLECTIONS.TRUSTED_ISSUER_CREDENTIALS;
        addressRoleStatus = ADDRESS_ROLES.COMPANY_APPROVED;
        break;
      case "employee":
        collection = COLLECTIONS.TRUSTED_EMPLOYEE_CREDENTIALS;
        addressRoleStatus = ADDRESS_ROLES.EMPLOYEE_APPROVED;
        break;
    }

    await addCredentialInDb(collection, credential);
    await setAddressRoleInDb(
      credential.credentialSubject.id.split(":").pop(),
      addressRoleStatus,
    );
    return true;
  } catch (error) {
    console.error("Error adding document:", error);
    return false;
  }
};

const updateApplicationStatus = async (key: string, role: string) => {
  let collection = "";
  switch (role) {
    case "company":
      collection = COLLECTIONS.COMPANY_APPLICATIONS;
      break;
    case "employee":
      collection = COLLECTIONS.EMPLOYEE_APPLICATIONS;
      break;
  }
  if (!role) return false;
  try {
    await updateApplicationStatusInDb(collection, key);
    return true;
  } catch (error) {
    console.error("Error updating application status: ", error);
    return false;
  }
};
