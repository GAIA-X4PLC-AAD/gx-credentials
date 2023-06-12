import {
  CompanyApplication,
  EmployeeApplication,
} from "@/types/CompanyApplication";
import { db } from "../config/firebase";
import {
  DocumentSnapshot,
  QuerySnapshot,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore/lite";

// Return the credentials of an issuer from the TrustedIssuerCredentials collection based on the address
export const getIssuerCredentials = async (address: string) => {
  const q = query(
    collection(db, "TrustedIssuerCredentials"),
    where("address", "==", address),
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => doc.data());
};

// Get map of trusted issuers name and addresses from the TrustedIssuerCredentials collection
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

// Add a new application to the database
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

// Return pending applications from the database based on the collection name
export const getApplications = async (coll: string, companyId?: string) => {
  const q = companyId
    ? query(collection(db, coll), where("companyId", "==", companyId))
    : query(collection(db, coll));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => doc.data());
};

// Return the verified credentials from the database based on the collection name
export const getCredentials = async (coll: string) => {
  const q = query(collection(db, coll));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => doc.data());
};

// Function to add or update an address-role document in Firestore
export async function setAddressRole(address: string, role: string) {
  try {
    // Get a reference to the document with the given address
    const docRef = doc(db, "AddressRole", address);
    const docSnap: DocumentSnapshot = await getDoc(docRef);

    // If the document exists, update it. If it does not exist, create it.
    if (docSnap.exists()) {
      // Update the document
      await updateDoc(docRef, { role: role });
    } else {
      // Create the document
      await setDoc(docRef, { address: address, role: role });
    }
  } catch (error) {
    console.log("Error setting AddressRole document: ", error);
    return false;
  }
  return true;
}

export async function getAddressRoles(address?: string) {
  try {
    // If an address is provided, get the document with the given address
    // If no address is provided, get all documents in the collection
    if (address) {
      const docRef = doc(db, "AddressRole", address);
      const docSnap: DocumentSnapshot = await getDoc(docRef);

      // If the document exists, return its data. Otherwise, return null.
      if (docSnap.exists()) {
        return docSnap.data();
      } else {
        return null;
      }
    } else {
      const collectionRef = collection(db, "AddressRole");
      const querySnapshot: QuerySnapshot = await getDocs(collectionRef);

      // Return all documents in the collection. If there are no documents, return an empty array.
      return querySnapshot.docs.map((doc) => doc.data());
    }
  } catch (error) {
    console.log("Error getting AddressRole document: ", error);
    return null;
  }
}
