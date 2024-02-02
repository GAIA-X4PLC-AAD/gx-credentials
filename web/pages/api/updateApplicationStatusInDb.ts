import {
  setAddressRoleInDb,
  updateApplicationStatusInDb,
} from "@/lib/database";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";
import type { NextApiRequest, NextApiResponse } from "next";
import { ADDRESS_ROLES } from "@/constants/constants";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>,
) {
  const session = await getServerSession(req, res, authOptions);
  console.log("Inside updateApplicationStatusInDb.ts");

  if (session) {
    try {
      const { collection, address, status } = req.body;
      console.log("Address: ", address);
      console.log("Status: ", status);

      await updateApplicationStatusInDb(collection, address, status);
      await setAddressRoleInDb(address, ADDRESS_ROLES.EMPLOYEE_REJECTED);

      res.status(200).json({
        message: "Application status and Address role updated successfully",
      });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error updating application status", error });
    }
    res.end();
  } else {
    // Not Signed in
    res.status(401);
  }
}
