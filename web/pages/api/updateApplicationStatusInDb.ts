import { updateApplicationStatusInDb } from "@/lib/database";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  res: NextApiResponse<any>,
): Promise<void> {
  const session = await getServerSession(req, res, authOptions);
  console.log("Inside updateApplicationStatusInDb.ts");

  if (session) {
    try {
      const { collection, id, status } = req.body;

      await updateApplicationStatusInDb(collection, id, status);

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
