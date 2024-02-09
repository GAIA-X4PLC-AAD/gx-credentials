/*
 * Copyright (C) 2023, Software Engineering for Business Information Systems (sebis) <matthes@tum.de>
 * SPDX-License-Identifier: Apache-2.0
 */
import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";
import type { NextApiRequest, NextApiResponse } from "next";
import type { CompanyApplication } from "../../types/CompanyApplication";
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
      const ca: CompanyApplication = {
        legalName: req.body.legalName,
        registrationNumber: req.body.registrationNumber,
        headquarterAddress: req.body.headquarterAddress,
        legalAddress: req.body.legalAddress,
        parentOrganization: req.body.parentOrganization,
        subOrganization: req.body.subOrganization,
        applicationText: req.body.applicationText,
        address: session.user!.pkh,
        timestamp: new Date().getTime().toString(),
        status: APPLICATION_STATUS.PENDING,
      };
      if (await writeApplicationToDb(ca)) res.status(200);
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
