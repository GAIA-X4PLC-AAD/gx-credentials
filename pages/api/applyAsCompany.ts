import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";
import { db } from "../../config/firebase";
import { doc, setDoc } from "firebase/firestore/lite";

export default async function handler(req, res) {
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
      };
      if (await writeCompanyApplication(ca)) res.status(200);
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

type CompanyApplication = {
  name: string;
  gx_id: string;
  description: string;
  address: string;
};

const writeCompanyApplication = async (ca: CompanyApplication) => {
  return setDoc(doc(db, "CompanyApplication", ca.address), { ...ca })
    .then(() => {
      console.log("Document successfully written!");
      return true;
    })
    .catch((error) => {
      console.error("Error adding document: ", error);
      return false;
    });
};
