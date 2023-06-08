import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";
import { db } from "../../config/firebase";
import { doc, setDoc } from "firebase/firestore/lite";
import type { NextApiRequest, NextApiResponse } from "next";
import type {
  CompanyApplication,
  EmployeeApplication,
} from "../../types/CompanyApplication";
import { writeApplicationToDatabase } from "@/lib/database";

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
        status: "pending",
      };
      if (await writeApplicationToDatabase(ea)) res.status(200);
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
