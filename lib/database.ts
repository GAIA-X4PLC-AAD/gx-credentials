import {
  CompanyApplication,
  EmployeeApplication,
} from "@/types/CompanyApplication";
import { db } from "../config/firebase";
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore/lite";

export const getIssuerCredentials = async (address: string) => {
  const q = query(
    collection(db, "TrustedIssuerCredentials"),
    where("address", "==", address),
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => doc.data());
};

export const getTrustedIssuers = async () => {
  const q = query(collection(db, "TrustedIssuerCredentials"));
  const querySnapshot = await getDocs(q);

  const resultMap = new Map();

  querySnapshot.docs.forEach((doc) => {
    const data = doc.data();
    const legalName = data.credential.credentialSubject["gx:legalName"];
    const address = data.address;
    resultMap.set(legalName, address);
  });

  return resultMap;
};

export const writeApplicationToDatabase = async (
  application: CompanyApplication | EmployeeApplication,
) => {
  let collection = (application as EmployeeApplication).employeeId
    ? "EmployeeApplications"
    : "CompanyApplications";

  return setDoc(
    doc(db, collection, application.address + "-" + application.timestamp),
    { ...application },
  )
    .then(() => {
      console.log("Document successfully written!");
      return true;
    })
    .catch((error) => {
      console.error("Error adding document: ", error);
      return false;
    });
};
