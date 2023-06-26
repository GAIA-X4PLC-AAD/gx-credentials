/*
 * Copyright (C) 2023, Software Engineering for Business Information Systems (sebis) <matthes@tum.de>
 * SPDX-License-Identifier: Apache-2.0
 */
import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";
import type { NextApiRequest, NextApiResponse } from "next";
import type { EmployeeApplication } from "../../types/CompanyApplication";
import { setAddressRoleInDb, writeApplicationToDb } from "@/lib/database";
import { ADDRESS_ROLES, APPLICATION_STATUS } from "@/constants/constants";

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
        name: req.body.name,
        employeeId: req.body.employeeId,
        companyId: req.body.companyId,
        companyName: req.body.companyName,
        address: session.user!.pkh,
        timestamp: new Date().getTime().toString(),
        status: APPLICATION_STATUS.PENDING,
      };
      if (
        (await writeApplicationToDb(ea)) &&
        (await setAddressRoleInDb(ea.address, ADDRESS_ROLES.EMPLOYEE_APPLIED))
      )
        res.status(200);
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
