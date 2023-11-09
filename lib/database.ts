/*
 * Copyright (C) 2023, Software Engineering for Business Information Systems (sebis) <matthes@tum.de>
 * SPDX-License-Identifier: Apache-2.0
 */
import {
  CompanyApplication,
  EmployeeApplication,
} from "@/types/CompanyApplication";
import { APPLICATION_STATUS, COLLECTIONS } from "@/constants/constants";
import { ObjectId } from "mongodb";
import { connectToDatabase } from "@/config/mongo";

// Get map of trusted issuers name and addresses from the TrustedIssuerCredentials collection
export const getTrustedIssuersFromDb = async () => {
  try {
    const { db } = await connectToDatabase();
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
  const { db } = await connectToDatabase();
  let collectionName = (application as EmployeeApplication).employeeId
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

export const getApplicationsFromDb = async (
  coll: string,
  companyId?: string,
) => {
  try {
    const { db } = await connectToDatabase();
    const collection = db.collection(coll);
    const filter = companyId ? { companyId: companyId } : {};

    // Retrieve documents and map _id to a string
    const docs = await collection.find(filter).toArray();
    const serializedDocs = docs.map((doc) => ({
      ...doc,
      _id: doc._id.toString(), // Convert ObjectId to string
    }));

    return serializedDocs;
  } catch (error) {
    console.log("Error getting documents: ", error);
    throw new Error(String(error));
  }
};

// Return the verified credentials from the database based on the collection name
export const getCredentialsFromDb = async (coll: string, address: string) => {
  try {
    const { db } = await connectToDatabase();
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
    const { db } = await connectToDatabase();
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
  console.log("AddressRole document successfully set!");
  return true;
}

export async function getAddressRolesFromDb(address?: string) {
  try {
    const { db } = await connectToDatabase();
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
  collectionName: string, // Name of the MongoDB collection
  address: string, // Address to identify the document to update
  status = APPLICATION_STATUS.APPROVED, // New status (default is "approved")
) => {
  try {
    const { db } = await connectToDatabase(); // Connect to the MongoDB
    const collection = db.collection(collectionName); // Get the specified collection
    console.log("Address: ", address); // Log the provided address
    console.log("Status: ", status); // Log the new status
    console.log("Collection: ", collectionName); // Log the collection name

    // Create a filter to identify the document by the "address" field
    const filter = { address: address };

    // Use updateOne to update the document matching the filter
    await collection.updateOne(filter, { $set: { status: status } });

    console.log("Application status successfully updated!");
  } catch (error) {
    console.log("Error updating document: ", error); // Log any errors
    throw new Error(String(error)); // Throw an error if something goes wrong
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
    const { db } = await connectToDatabase();
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
    const { db } = await connectToDatabase();
    const collection = db.collection(collectionName);
    const filter = { _id: new ObjectId(credentialId) };

    await collection.updateOne(filter, {
      $set: { status: APPLICATION_STATUS.REVOKED },
    });
    console.log("Document successfully updated!");
  } catch (error) {
    console.log("Error updating document: ", error);
    throw new Error(String(error));
  }
};
