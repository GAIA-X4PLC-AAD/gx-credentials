import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";
import type { NextApiRequest, NextApiResponse } from "next";
import type { CompanyApplication } from "../../types/CompanyApplication";
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
      const ca: CompanyApplication = {
        name: req.body.name,
        gx_id: req.body.gx_id,
        description: req.body.description,
        address: session.user!.pkh,
        timestamp: new Date().getTime().toString(),
        status: APPLICATION_STATUS.PENDING,
      };
      if (
        (await writeApplicationToDb(ca)) &&
        (await setAddressRoleInDb(ca.address, ADDRESS_ROLES.COMPANY_APPLIED))
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
