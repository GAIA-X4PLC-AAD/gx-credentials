/*
 * Copyright (C) 2023, Software Engineering for Business Information Systems (sebis) <matthes@tum.de>
 * SPDX-License-Identifier: Apache-2.0
 */

import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";
import type { NextApiRequest, NextApiResponse } from "next";
import { addCredentialToDb, updateApplicationStatusInDb } from "@/lib/database";
import { COLLECTIONS } from "@/constants/constants";

export default async function handler(
  req: NextApiRequest,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  res: NextApiResponse<any>,
): Promise<void> {
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