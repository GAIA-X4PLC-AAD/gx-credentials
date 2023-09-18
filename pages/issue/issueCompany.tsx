/*
 * Copyright (C) 2023, Software Engineering for Business Information Systems (sebis) <matthes@tum.de>
 * SPDX-License-Identifier: Apache-2.0
 */
import React, { useState } from "react";
import { getSession } from "next-auth/react";
import { NextPageContext } from "next";
import { issueCompanyCredential } from "../../lib/credentials";
import { CompanyApplication } from "@/types/CompanyApplication";
import axios from "axios";
import {
  getRegistrars,
  writeTrustedIssuerLog,
} from "@/lib/registryInteraction";
import {
  getApplicationsFromDb,
  updateApplicationStatusInDb,
} from "@/lib/database";
import { APPLICATION_STATUS, COLLECTIONS } from "@/constants/constants";

export default function IssueCompany(props: any) {
  const [applications, setApplications] = React.useState<CompanyApplication[]>(
    props.pendingCompanyApplications,
  );
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  function delay(milliseconds: number) {
    return new Promise((resolve) => {
      setTimeout(resolve, milliseconds);
    });
  }

  const handleAcceptCompanyIssuance = async (
    application: CompanyApplication,
  ) => {
    setIsProcessing(true); // Set processing state to true
    let credential = null;
    try {
      // Issue credential
      credential = await issueCompanyCredential(application);
      console.log("credential: ", credential);
    } catch (error) {
      setIsProcessing(false);
      console.log("Error issuing credential: ", error);
      return;
    }

    await delay(2000);

    try {
      // write credential issuance to issuer registry
      await writeTrustedIssuerLog(application.address);
    } catch (error) {
      setIsProcessing(false);
      console.log("Error publishing credential to issuer registry: ", error);
      return;
    }

    // Update database with credential issuance
    axios
      .post("/api/publishCredential", {
        credential: credential,
        role: "company",
        applicationKey: application.address + "-" + application.timestamp,
      })
      .then(async function (response) {
        application.status = APPLICATION_STATUS.APPROVED;
        const updatedApplications = applications.map((app) => {
          if (app.address === application.address) {
            return application;
          }
          return app;
        });
        setApplications(updatedApplications);
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      })
      .finally(() => {
        setIsProcessing(false);
      })
      .finally(() => {
        setIsProcessing(false);
      });
  };

  const handleRejectCompanyIssuance = async (
    application: CompanyApplication,
  ) => {
    setIsProcessing(true); // Set processing state to true
    try {
      // Update database with credential issuance
      await updateApplicationStatusInDb(
        COLLECTIONS.COMPANY_APPLICATIONS,
        application.address + "-" + application.timestamp,
        APPLICATION_STATUS.REJECTED,
      );
      const updatedApplications: any = await getApplicationsFromDb(
        COLLECTIONS.COMPANY_APPLICATIONS,
      );
      setApplications(updatedApplications);
      setIsProcessing(false);
    } catch (error) {
      setIsProcessing(false);
      console.log(
        "Could not update application Reject status in database",
        error,
      );
    }
  };

  const whiteShadow = {
    boxShadow: "0px 0px 10px 3px rgba(255,255,255,0.75)",
  };

  return (
    <main className="ml-20 mt-10">
      <h2>Pending Company Applications</h2>
      <div className="flex flex-col w-5/6">
        <div
          className="overflow-x-auto shadow rounded-lg border border-white"
          style={whiteShadow}
        >
          <table className="min-w-full text-center text-sm font-light">
            <thead className="border-b bg-gray-500 font-medium border-neutral-500 text-black">
              <tr>
                <th scope="col" className=" px-6 py-4">
                  GX ID
                </th>
                <th scope="col" className=" px-6 py-4">
                  Company Name
                </th>
                <th scope="col" className=" px-6 py-4">
                  Public Key Hash
                </th>
                <th scope="col" className=" px-6 py-4">
                  Description
                </th>
                <th scope="col" className=" px-6 py-4"></th>
              </tr>
            </thead>
            <tbody>
              {applications.map((application: any) => (
                <tr
                  className="border-b border-neutral-500"
                  key={application.address}
                >
                  <td className="whitespace-nowrap  px-6 py-4 font-medium">
                    {application.gx_id}
                  </td>
                  <td className="whitespace-nowrap  px-6 py-4">
                    {application.name}
                  </td>
                  <td className="whitespace-nowrap  px-6 py-4">
                    {application.address}
                  </td>
                  <td className="whitespace-nowrap  px-6 py-4">
                    {application.description}
                  </td>
                  {application.status === "pending" ? (
                    <td className="whitespace-nowrap px-6 py-4">
                      <button
                        disabled={isProcessing}
                        onClick={() => handleAcceptCompanyIssuance(application)}
                        className="mr-2"
                      >
                        Accept
                      </button>
                      <button
                        disabled={isProcessing}
                        onClick={() => handleRejectCompanyIssuance(application)}
                      >
                        Reject
                      </button>
                    </td>
                  ) : application.status === "approved" ? (
                    <td>
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-200 text-green-800">
                        Approved
                      </span>
                    </td>
                  ) : (
                    <td>
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium  bg-red-200 text-red-700">
                        Rejected
                      </span>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {isProcessing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-white"></div>
        </div>
      )}
    </main>
  );
}

export async function getServerSideProps(context: NextPageContext) {
  try {
    const session = await getSession(context);
    const registrars = await getRegistrars();
    if (!session || !registrars) {
      return {
        redirect: {
          destination: "/",
          permanent: false,
        },
      };
    }

    if (!registrars.includes(session.user?.pkh)) {
      return {
        redirect: {
          destination: "/common/unauthorised",
          permanent: false,
        },
      };
    }

    return {
      props: {
        pendingCompanyApplications: await getApplicationsFromDb(
          COLLECTIONS.COMPANY_APPLICATIONS,
        ),
      },
    };
  } catch (error) {
    return {
      redirect: {
        destination: "/common/error",
        permanent: false,
      },
    };
  }
}
