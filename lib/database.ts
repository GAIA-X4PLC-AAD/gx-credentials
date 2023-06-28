/*
 * Copyright (C) 2023, Software Engineering for Business Information Systems (sebis) <matthes@tum.de>
 * SPDX-License-Identifier: Apache-2.0
 */
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
import { APPLICATION_STATUS, COLLECTIONS } from "@/constants/constants";

// Get map of trusted issuers name and addresses from the TrustedIssuerCredentials collection
export const getTrustedIssuersFromDb = async () => {
  try {
    const q = query(collection(db, COLLECTIONS.TRUSTED_ISSUER_CREDENTIALS));
    const querySnapshot = await getDocs(q);

    const resultMap = new Map();

    querySnapshot.docs.forEach((doc) => {
      const data = doc.data();
      const legalName = data.credential.credentialSubject["gx:legalName"];
      const address = data.address;
      resultMap.set(legalName, address);
    });

    return resultMap;
  } catch (error) {
    console.log("Error getting documents: ", error);
    throw new Error(String(error));
  }
};

// Add a new application to the database
export const writeApplicationToDb = async (
  application: CompanyApplication | EmployeeApplication,
) => {
  let collection = (application as EmployeeApplication).employeeId
    ? COLLECTIONS.EMPLOYEE_APPLICATIONS
    : COLLECTIONS.COMPANY_APPLICATIONS;

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
export const getApplicationsFromDb = async (
  coll: string,
  companyId?: string,
) => {
  try {
    const q = companyId
      ? query(collection(db, coll), where("companyId", "==", companyId))
      : query(collection(db, coll));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => doc.data());
  } catch (error: any) {
    console.log("Error getting documents: ", error);
    throw new Error(error);
  }
};

// Return the verified credentials from the database based on the collection name
export const getCredentialsFromDb = async (coll: string, address: string) => {
  try {
    const q = query(collection(db, coll), where("address", "==", address));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => doc.data());
  } catch (error) {
    console.log("Error getting documents: ", error);
    throw new Error(String(error));
  }
};

// Function to add or update an address-role document in Firestore
export async function setAddressRoleInDb(address: string, role: string) {
  try {
    // Get a reference to the document with the given address
    const docRef = doc(db, COLLECTIONS.ADDRESS_ROLES, address);
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

export async function getAddressRolesFromDb(address?: string) {
  try {
    // If an address is provided, get the document with the given address
    // If no address is provided, get all documents in the collection
    if (address) {
      const docRef = doc(db, COLLECTIONS.ADDRESS_ROLES, address);
      const docSnap: DocumentSnapshot = await getDoc(docRef);

      // If the document exists, return its data. Otherwise, return null.
      if (docSnap.exists()) {
        return docSnap.data();
      } else {
        return null;
      }
    } else {
      const collectionRef = collection(db, COLLECTIONS.ADDRESS_ROLES);
      const querySnapshot: QuerySnapshot = await getDocs(collectionRef);

      // Return all documents in the collection. If there are no documents, return an empty array.
      return querySnapshot.docs.map((doc) => doc.data());
    }
  } catch (error) {
    console.log("Error getting AddressRole document: ", error);
    return null;
  }
}

export const updateApplicationStatusInDb = async (
  collection: string,
  key: string,
  status = APPLICATION_STATUS.APPROVED,
) => {
  try {
    await updateDoc(doc(db, collection, key), {
      status: status,
    });
    console.log("Document successfully written!");
  } catch (error) {
    console.log("Error getting documents: ", error);
    throw new Error(String(error));
  }
};

export const addCredentialInDb = async (
  collection: string,
  credential: any,
) => {
  const dbObj = {
    address: credential.credentialSubject.id.split(":").pop(),
    credential: credential,
  };
  try {
    await setDoc(doc(db, collection, credential.id), dbObj);
    console.log("Document successfully written!");
  } catch (error) {
    console.log("Error getting documents: ", error);
    throw new Error(String(error));
  }
};

export const revokeCredentialInDb = async (
  collection: string,
  credentialId: string,
) => {
  try {
    await updateDoc(doc(db, collection, credentialId), {
      status: APPLICATION_STATUS.REVOKED,
    });
    console.log("Document successfully written!");
  } catch (error) {
    console.log("Error getting documents: ", error);
    throw new Error(String(error));
  }
};
