import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";
import { db } from "../../config/firebase";
import { doc, setDoc } from "firebase/firestore/lite";
import type { NextApiRequest, NextApiResponse } from "next";
import type { CompanyApplication } from "../../types/CompanyApplication";
import { setAddressRole, writeApplicationToDatabase } from "@/lib/database";

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
        status: "pending",
      };
      if (
        (await writeApplicationToDatabase(ca)) &&
        (await setAddressRole(ca.address, "companyApplied"))
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
