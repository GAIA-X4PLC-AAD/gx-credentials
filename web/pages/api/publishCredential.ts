/*
 * Copyright (C) 2023, Software Engineering for Business Information Systems (sebis) <matthes@tum.de>
 * SPDX-License-Identifier: Apache-2.0
 */

import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";
import type { NextApiRequest, NextApiResponse } from "next";
import { addCredentialToDb, updateApplicationStatusInDb } from "@/lib/database";
import { COLLECTIONS } from "@/constants/constants";

// This is the publishCredential API route that is called by the frontend to publish a credential to the database.
// It generates the credential from the application data , writes it to database, and updates the application status.
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
      await addCredentialToDb(
        req.body.application.role
          ? COLLECTIONS.TRUSTED_EMPLOYEE_CREDENTIALS
          : COLLECTIONS.TRUSTED_ISSUER_CREDENTIALS,
        req.body.credential,
      );

      // update application for that credential on db
      await updateApplicationStatusInDb(
        req.body.application.role
          ? COLLECTIONS.EMPLOYEE_APPLICATIONS
          : COLLECTIONS.COMPANY_APPLICATIONS,
        req.body.application._id,
      );

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

// Helper function to write credential to db and update Address Role status
const writeTrustedIssuerCredential = async (credential: any, role: string) => {
  try {
    let collection = "";
    switch (role) {
      case "company":
        collection = COLLECTIONS.TRUSTED_ISSUER_CREDENTIALS;
        break;
      case "employee":
        collection = COLLECTIONS.TRUSTED_EMPLOYEE_CREDENTIALS;
        break;
    }

    await addCredentialToDb(collection, credential);
    return true;
  } catch (error) {
    console.error("Error adding document:", error);
    return false;
  }
};
