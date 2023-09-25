/*
 * Copyright (C) 2023, Software Engineering for Business Information Systems (sebis) <matthes@tum.de>
 * SPDX-License-Identifier: Apache-2.0
 */
import {
  CompanyApplication,
  EmployeeApplication,
} from "@/types/CompanyApplication";
import { getDb } from "@/config/mongo";
import { APPLICATION_STATUS, COLLECTIONS } from "@/constants/constants";

const db = getDb();

// Get map of trusted issuers name and addresses from the TrustedIssuerCredentials collection
export const getTrustedIssuersFromDb = async () => {
  try {
    const collection = db.collection(COLLECTIONS.TRUSTED_ISSUER_CREDENTIALS);

    // The find method returns a cursor, but for this case, we'll convert it to an array
    const docs = await collection.find().toArray();

    const resultMap = new Map();

    docs.forEach((doc: any) => {
      const legalName = doc.credential.credentialSubject["gx:legalName"];
      const address = doc.address;
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
  let collectionName = (application as EmployeeApplication).employeeId
    ? COLLECTIONS.EMPLOYEE_APPLICATIONS
    : COLLECTIONS.COMPANY_APPLICATIONS;

  const collection = db.collection(collectionName);

  try {
    await collection.insertOne(application);
    console.log("Document successfully written!");
    return true;
  } catch (error) {
    console.error("Error adding document: ", error);
    return false;
  }
};

// Return pending applications from the database based on the collection name
export const getApplicationsFromDb = async (
  coll: string,
  companyId?: string,
) => {
  try {
    const collection = db.collection(coll);
    const filter = companyId ? { companyId: companyId } : {};

    const docs = await collection.find(filter).toArray();

    return docs;
  } catch (error) {
    console.log("Error getting documents: ", error);
    throw new Error(String(error));
  }
};

// Return the verified credentials from the database based on the collection name
export const getCredentialsFromDb = async (coll: string, address: string) => {
  try {
    const collection = db.collection(coll);
    const filter = { address: address };

    const docs = await collection.find(filter).toArray();

    return docs;
  } catch (error) {
    console.log("Error getting documents: ", error);
    throw new Error(String(error));
  }
};

// Function to add or update an address-role document in MongoDB
export async function setAddressRoleInDb(address: string, role: string) {
  try {
    const collection = db.collection(COLLECTIONS.ADDRESS_ROLES);
    const filter = { address: address };

    const document = await collection.findOne(filter);

    if (document) {
      // Update the document
      await collection.updateOne(filter, { $set: { role: role } });
    } else {
      // Create the document
      await collection.insertOne({ address: address, role: role });
    }
  } catch (error) {
    console.log("Error setting AddressRole document: ", error);
    return false;
  }
  return true;
}

export async function getAddressRolesFromDb(address?: string) {
  try {
    const collection = db.collection(COLLECTIONS.ADDRESS_ROLES);

    if (address) {
      const filter = { address: address };
      const document = await collection.findOne(filter);

      return document ? document : null;
    } else {
      const docs = await collection.find().toArray();
      return docs;
    }
  } catch (error) {
    console.log("Error getting AddressRole document: ", error);
    return null;
  }
}

// Function to update the application status in MongoDB
export const updateApplicationStatusInDb = async (
  collectionName: string,
  key: string,
  status = APPLICATION_STATUS.APPROVED,
) => {
  try {
    const collection = db.collection(collectionName);
    const filter = { _id: key };

    await collection.updateOne(filter, { $set: { status: status } });
    console.log("Document successfully updated!");
  } catch (error) {
    console.log("Error updating document: ", error);
    throw new Error(String(error));
  }
};

// Function to add credential in MongoDB
export const addCredentialInDb = async (
  collectionName: string,
  credential: any,
) => {
  const dbObj = {
    address: credential.credentialSubject.id.split(":").pop(),
    credential: credential,
  };
  try {
    const collection = db.collection(collectionName);

    await collection.insertOne(dbObj);
    console.log("Document successfully added!");
  } catch (error) {
    console.log("Error adding document: ", error);
    throw new Error(String(error));
  }
};

// Function to revoke credential in MongoDB
export const revokeCredentialInDb = async (
  collectionName: string,
  credentialId: string,
) => {
  try {
    const collection = db.collection(collectionName);
    const filter = { _id: credentialId }; // Assuming the credentialId is the '_id' in MongoDB

    await collection.updateOne(filter, {
      $set: { status: APPLICATION_STATUS.REVOKED },
    });
    console.log("Document successfully updated!");
  } catch (error) {
    console.log("Error updating document: ", error);
    throw new Error(String(error));
  }
};
