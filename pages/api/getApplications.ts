import { getApplicationsFromDb } from "@/lib/database";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>,
) {
  const session = await getServerSession(req, res, authOptions);

  if (session) {
    try {
      const { collection } = req.body;
      const applications = await getApplicationsFromDb(collection);
      res.status(200).json(applications);
    } catch (error) {
      res.status(500).json({ message: "Error fetching applications", error });
    }
  } else {
    // Not Signed in
    res.status(401);
  }
  res.end();
}
