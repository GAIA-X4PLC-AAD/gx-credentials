/*
 * Copyright (C) 2023, Software Engineering for Business Information Systems (sebis) <matthes@tum.de>
 * SPDX-License-Identifier: Apache-2.0
 */
import {
  CompanyApplication,
  EmployeeApplication,
} from "@/types/CompanyApplication";
import { APPLICATION_STATUS, COLLECTIONS } from "@/constants/constants";
import { connectToDatabase } from "@/config/mongo";
import { ObjectId } from "mongodb";

// Get map of trusted issuers name and addresses from the TrustedIssuerCredentials collection
export const getTrustedIssuersFromDb = async () => {
  try {
    const { db } = await connectToDatabase();
    const collection = db.collection(COLLECTIONS.TRUSTED_ISSUER_CREDENTIALS);

    // The find method returns a cursor, but for this case, we'll convert it to an array
    const docs = await collection.find().toArray();

    const resultMap = new Map();

    docs.forEach((doc: any) => {
      const legalName = doc.credential.credentialSubject["gx:legalName"]
        ? doc.credential.credentialSubject["gx:legalName"]
        : "UNKNOWN NAME";
      const address = doc.address;
      resultMap.set(legalName, address);
    });

    return resultMap;
  } catch (error) {
    console.log("Error getting documents: ", error);
    throw new Error(String(error));
  }
};

export const writeApplicationToDb = async (
  application: CompanyApplication | EmployeeApplication,
) => {
  const { db } = await connectToDatabase();
  let collectionName = (application as EmployeeApplication).role
    ? COLLECTIONS.EMPLOYEE_APPLICATIONS
    : COLLECTIONS.COMPANY_APPLICATIONS;

  const collection = db.collection(collectionName);

  try {
    // Insert the document into the collection
    await collection.insertOne(application);

    console.log("Application document successfully written!");
    return true;
  } catch (error) {
    console.error("Error adding document: ", error);
    return false;
  }
};

export const getCompanyApplicationsFromDb = async (
  address?: string,
  companyAddress?: string,
) => {
  try {
    const { db } = await connectToDatabase();
    const collection = db.collection(COLLECTIONS.COMPANY_APPLICATIONS);
    let filter: any = companyAddress ? { companyAddress: companyAddress } : {};
    filter = address ? { ...filter, address: address } : filter;
    const docs = await collection.find(filter).toArray();
    return docs as unknown as Array<CompanyApplication>;
  } catch (error) {
    console.log("Error getting documents: ", error);
    throw new Error(String(error));
  }
};

export const getEmployeeApplicationsFromDb = async (address?: string) => {
  try {
    const { db } = await connectToDatabase();
    const collection = db.collection(COLLECTIONS.EMPLOYEE_APPLICATIONS);
    let filter: any = address ? { address: address } : {};
    const docs = await collection.find(filter).toArray();
    return docs as unknown as Array<EmployeeApplication>;
  } catch (error) {
    console.log("Error getting documents: ", error);
    throw new Error(String(error));
  }
};

export const getApplicationsFromDb = async (address: string) => {
  const companyApplications = await getCompanyApplicationsFromDb(address);
  const employeeApplications = await getEmployeeApplicationsFromDb(address);
  return [...companyApplications, ...employeeApplications].sort(
    (a, b) => parseInt(b.timestamp) - parseInt(a.timestamp),
  );
};

export const getWrappedCompanyCredentialsFromDb = async (address?: string) => {
  try {
    const { db } = await connectToDatabase();
    const collection = db.collection(COLLECTIONS.TRUSTED_ISSUER_CREDENTIALS);
    const filter = { address: address };
    const docs = await collection.find(filter).toArray();
    return docs;
  } catch (error) {
    console.log("Error getting documents: ", error);
    throw new Error(String(error));
  }
};

export const getWrappedEmployeeCredentialsFromDb = async (address?: string) => {
  try {
    const { db } = await connectToDatabase();
    const collection = db.collection(COLLECTIONS.TRUSTED_EMPLOYEE_CREDENTIALS);
    const filter = { address: address };
    const docs = await collection.find(filter).toArray();
    return docs;
  } catch (error) {
    console.log("Error getting documents: ", error);
    throw new Error(String(error));
  }
};

export const getWrappedCredentialsFromDb = async (address: string) => {
  const companyCredentials = await getWrappedCompanyCredentialsFromDb(address);
  const employeeCredentials =
    await getWrappedEmployeeCredentialsFromDb(address);
  return [...companyCredentials, ...employeeCredentials].sort(
    (a, b) => parseInt(b.timestamp) - parseInt(a.timestamp),
  );
};

export const updateApplicationStatusInDb = async (
  collectionName: string, // Name of the MongoDB collection
  id: string,
  status = APPLICATION_STATUS.APPROVED, // New status (default is "approved")
) => {
  try {
    const { db } = await connectToDatabase(); // Connect to the MongoDB
    const collection = db.collection(collectionName); // Get the specified collection

    // Create a filter to identify the document by the "address" field
    const filter = { _id: new ObjectId(id) };

    // Use updateOne to update the document matching the filter
    await collection.updateOne(filter, { $set: { status: status } });

    console.log("Application status successfully updated!");
  } catch (error) {
    console.log("Error updating document: ", error); // Log any errors
    throw new Error(String(error)); // Throw an error if something goes wrong
  }
};

export const addCredentialToDb = async (
  collectionName: string,
  credential: any,
) => {
  const dbObj = {
    address: credential.credentialSubject.id.split(":").pop(),
    credential: credential,
  };
  try {
    const { db } = await connectToDatabase();
    const collection = db.collection(collectionName);

    await collection.insertOne(dbObj);
    console.log("Document successfully added!");
  } catch (error) {
    console.log("Error adding document: ", error);
    throw new Error(String(error));
  }
};

export const userHasCredentialOrApplication = async (address: string) => {
  if ((await getApplicationsFromDb(address)).length > 0) return true;
  if ((await getWrappedCredentialsFromDb(address)).length > 0) return true;
  return false;
};
