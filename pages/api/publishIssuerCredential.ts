import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";
import { db } from "../../config/firebase";
import { doc, setDoc, updateDoc } from "firebase/firestore/lite";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const session = await getServerSession(req, res, authOptions);
  console.log(session);
  if (session) {
    // Signed in
    try {
      // write credential to db
      if (!(await writeTrustedIssuerCredential(req.body.credential)))
        res.status(500);
      // update application for that credential on db
      if (
        !(await updateApplicationStatus(req.body.applicationKey, req.body.role))
      )
        res.status(500);
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

const writeTrustedIssuerCredential = async (cred: any) => {
  try {
    const dbObj = {
      address: cred.credentialSubject.id.split(":").pop(),
      credential: cred,
    };
    await setDoc(doc(db, "TrustedIssuerCredentials", cred.id), dbObj);
    return true;
  } catch (error) {
    console.error("Error adding document:", error);
    return false;
  }
};

const updateApplicationStatus = async (key: string, role: string) => {
  let collection = "";
  switch (role) {
    case "company":
      collection = "CompanyApplications";
  }
  if (!role) return false;
  updateDoc(doc(db, collection, key), {
    status: "approved",
  })
    .then(() => {
      console.log("Document successfully written!");
      return true;
    })
    .catch((error) => {
      console.error("Error adding document: ", error);
      return false;
    });
};
