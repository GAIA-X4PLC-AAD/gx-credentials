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
      name: "Testcompany",
      gx_id: "1",
      description: "some words",
      address: "tz1Y5uKr9yy36TNmzdYwigiz4jYsCEWMCSED",
      timestamp: "1643655907",
      status: APPLICATION_STATUS.PENDING,
    };
    await writeApplicationToDb(appl);
    companyApplications = await getApplicationsFromDb(
      COLLECTIONS.COMPANY_APPLICATIONS,
    );
    expect(companyApplications.length).toEqual(1);
    expect(companyApplications[0]).toEqual({
      ...appl,
      _id: appl._id.toString(), // Convert ObjectId to string
    });
    const knownUser = await userHasCredentialOrApplication(appl.address);
    expect(knownUser).toBe(true);
  });
});
