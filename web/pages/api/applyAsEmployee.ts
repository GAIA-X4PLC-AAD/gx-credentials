/*
 * Copyright (C) 2023, Software Engineering for Business Information Systems (sebis) <matthes@tum.de>
 * SPDX-License-Identifier: Apache-2.0
 */
import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";
import type { NextApiRequest, NextApiResponse } from "next";
import type { EmployeeApplication } from "../../types/CompanyApplication";
import { writeApplicationToDb } from "@/lib/database";
import { APPLICATION_STATUS } from "@/constants/constants";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>,
) {
  const session = await getServerSession(req, res, authOptions);
  console.log(session);
  if (session) {
    // Signed in
    try {
      const ea: EmployeeApplication = {
        legalName: req.body.legalName,
        role: req.body.role,
        email: req.body.email,
        applicationText: req.body.applicationText,
        companyAddress: req.body.companyAddress,
        companyName: req.body.companyName,
        address: session.user!.pkh,
        timestamp: new Date().getTime().toString(),
        status: APPLICATION_STATUS.PENDING,
      };
      if (await writeApplicationToDb(ea)) res.status(200);
      else res.status(500);
    } catch (e) {
      res.status(500);
    }
  } else {
    // Not Signed in
    res.status(401);
  }
  res.end();
}
