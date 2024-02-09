/*
 * Copyright (C) 2023, Software Engineering for Business Information Systems (sebis) <matthes@tum.de>
 * SPDX-License-Identifier: Apache-2.0
 */
import { MongoMemoryServer } from "mongodb-memory-server";
import { connectToDatabase } from "@/config/mongo";
import {
  getApplicationsFromDb,
  writeApplicationToDb,
  userHasCredentialOrApplication,
} from "@/lib/database";
import { COLLECTIONS, APPLICATION_STATUS } from "@/constants/constants";

describe("writeApplicationToDb", () => {
  it("should write a CompanyApplication to the database", async () => {
    const application = {
      /* create a CompanyApplication object */
    };
    const result = await writeApplicationToDb(application);
    expect(result).toBe(true);
  });

  it("should write an EmployeeApplication to the database", async () => {
    const application = {
      /* create an EmployeeApplication object */
    };
    const result = await writeApplicationToDb(application);
    expect(result).toBe(true);
  });

  it("should handle error when writing to the database", async () => {
    const application = {
      /* create an application object */
    };
    const mockError = new Error("Database error");
    jest
      .spyOn(connectToDatabase, "connectToDatabase")
      .mockRejectedValue(mockError);
    const result = await writeApplicationToDb(application);
    expect(result).toBe(false);
  });
});

describe("database interactions", () => {
  let mongod;

  beforeAll(async () => {
    mongod = await MongoMemoryServer.create({
      instance: {
        port: 27017,
        ip: "127.0.0.1",
        dbName: process.env.MONGO_INITDB_DATABASE,
      },
      auth: {
        enable: true,
        customRootName: process.env.MONGO_INITDB_ROOT_USERNAME,
        customRootPwd: process.env.MONGO_INITDB_ROOT_PASSWORD,
      },
    });
    const { client } = await connectToDatabase();
    client.db(process.env.MONGO_INITDB_DATABASE).dropDatabase();
  });

  afterAll(async () => {
    const { client } = await connectToDatabase();
    client.close();
    await mongod.stop();
  });

  it("should write and read a company application", async () => {
    let companyApplications = await getApplicationsFromDb(
      COLLECTIONS.COMPANY_APPLICATIONS,
    );
    expect(companyApplications).toEqual([]);
    const appl = {
      legalName: "Testcompany",
      registrationNumber: "1",
      headquarterAddress: "DE-BY",
      legalAddress: "DE-BY",
      parentOrganization: "",
      subOrganization: "",
      applicationText: "some words",
      address: "tz1Y5uKr9yy36TNmzdYwigiz4jYsCEWMCSED",
      timestamp: "1643655907",
      status: APPLICATION_STATUS.PENDING,
    };
    await writeApplicationToDb(appl);
    companyApplications = await getApplicationsFromDb(
      COLLECTIONS.COMPANY_APPLICATIONS,
    );
    expect(companyApplications.length).toEqual(1);
    expect(companyApplications[0]).toEqual(appl);
    const knownUser = await userHasCredentialOrApplication(appl.address);
    expect(knownUser).toBe(true);
  });
});
