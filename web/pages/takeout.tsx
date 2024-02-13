/*
 * Copyright (C) 2023, Software Engineering for Business Information Systems (sebis) <matthes@tum.de>
 * SPDX-License-Identifier: Apache-2.0
 */
import React, { useState } from "react";
import { getSession } from "next-auth/react";
import { NextPageContext } from "next";
import {
  getWrappedCredentialsFromDb,
  getWrappedCompanyCredentialsFromDb,
  getApplicationsFromDb,
  getEmployeeApplicationsFromDb,
  getCompanyApplicationsFromDb,
} from "../lib/database";
import { dAppClient } from "../config/wallet";
import { SigningType } from "@airgap/beacon-sdk";
import { APPLICATION_STATUS, COLLECTIONS } from "@/constants/constants";
import {
  Tab,
  TabPanel,
  Tabs,
  TabsBody,
  TabsHeader,
} from "@material-tailwind/react";
import ApplicationCard from "../components/ApplicationCard";
import CredentialCard from "../components/CredentialCard";
import {
  CompanyApplication,
  EmployeeApplication,
} from "@/types/CompanyApplication";
import {
  issueCompanyCredential,
  issueEmployeeCredential,
} from "../lib/credentials";
import axios from "axios";
import { useRouter } from "next/router";
import { getRegistrars } from "@/lib/registryInteraction";
import { WithId } from "mongodb";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function Takeout(props: any): JSX.Element {
  const router = useRouter();
  const [applications, setApplications] = useState<
    (EmployeeApplication | CompanyApplication)[]
  >(props.pendingApplications);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const showIssuerTab = props.isIssuer || props.isRegistrar;
  const showCredentialsTab = !props.isRegistrar;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const downloadCredential = (credential: any): void => {
    const data = JSON.stringify(credential);
    const blob = new Blob([data], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "VerifiableCredential.json";
    link.click();
  };

  const transferCredentialToWallet = async (): Promise<void> => {
    await dAppClient?.requestSignPayload({
      signingType: SigningType.RAW,
      payload:
        "Get your GX Credential! #" + props.apiHost + "/api/takeoutCredential",
    });
  };

  const handleIssuance = async (
    application: CompanyApplication | EmployeeApplication,
  ): Promise<void> => {
    setIsProcessing(true);
    const isCompany = application.role ? false : true;
    let credential = null;
    try {
      if (isCompany)
        credential = await issueCompanyCredential(
          application as CompanyApplication,
        );
      else
        credential = await issueEmployeeCredential(
          application as EmployeeApplication,
        );
    } catch (error) {
      setIsProcessing(false);
      console.log("Error issuing credential: ", error);
      return;
    }

    // TODO status list write

    // Update database with credential issuance
    axios
      .post("/api/publishCredential", {
        credential: credential,
        application: application,
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
      });
  };

  const handleRejectApplication = async (
    application: CompanyApplication | EmployeeApplication,
  ): Promise<void> => {
    setIsProcessing(true);
    try {
      const collection = application.role
        ? COLLECTIONS.EMPLOYEE_APPLICATIONS
        : COLLECTIONS.COMPANY_APPLICATIONS;
      const response = await axios.post("/api/updateApplicationStatusInDb", {
        collection: collection,
        id: application._id,
        status: APPLICATION_STATUS.REJECTED,
      });

      // If the update was successful, update the state
      if (response.status === 200) {
        const updatedApplications = applications.map((app) => {
          if (app.address === application.address) {
            return { ...app, status: APPLICATION_STATUS.REJECTED };
          }
          return app;
        });
        setApplications(updatedApplications);
      }
    } catch (error) {
      console.error("Could not update application status", error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <main className="ml-20 mt-10">
      <div className="flex flex-col w-5/6">
        <Tabs className="" value={showCredentialsTab ? "Takeout" : "Issue"}>
          <TabsHeader
            style={{ display: "flex", justifyItems: "center", width: "50%" }}
          >
            {showCredentialsTab && (
              <Tab value="Takeout">Your Verifiable Credentials</Tab>
            )}
            {showIssuerTab && (
              <Tab value="Issue">
                {props.isRegistrar
                  ? "Issue to Companies"
                  : "Issue to Employees"}
              </Tab>
            )}
          </TabsHeader>
          <TabsBody>
            <TabPanel value="Takeout">
              {showCredentialsTab && (
                <div>
                  <div className="overflow-x-auto pb-4">
                    <div className="grid-cols-1 sm:grid md:grid-cols-2 ">
                      {props.userCredentials.map(
                        (credential: WithId<Document>) => (
                          <CredentialCard
                            key={credential._id.toString()}
                            wrappedCredential={credential}
                          >
                            <button
                              onClick={transferCredentialToWallet}
                              className="mr-2 drop-shadow-lg"
                            >
                              Beacon Wallet
                            </button>
                            <button
                              className="mr-2 drop-shadow-lg"
                              onClick={() => downloadCredential(credential)}
                            >
                              Raw Download
                            </button>
                          </CredentialCard>
                        ),
                      )}
                      {props.userApplications.map(
                        (
                          application: CompanyApplication | EmployeeApplication,
                        ) => (
                          <ApplicationCard
                            key={application._id.toString()}
                            application={application}
                          >
                            {application.status === "pending" ? (
                              <div>
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-200 text-gray-800">
                                  Pending
                                </span>
                              </div>
                            ) : application.status === "approved" ? (
                              <div>
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-200 text-green-800">
                                  Approved
                                </span>
                              </div>
                            ) : (
                              <div>
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium  bg-red-200 text-red-700">
                                  Rejected
                                </span>
                              </div>
                            )}
                          </ApplicationCard>
                        ),
                      )}
                    </div>
                  </div>
                  {!props.isEmployee && (
                    <button
                      onClick={() => router.push("/apply/applyAsCompany")}
                      className="mt-4 mr-4"
                    >
                      Apply for new Company Credential
                    </button>
                  )}
                  {!props.isIssuer && (
                    <button
                      onClick={() => router.push("/apply/applyAsEmployee")}
                      className="mt-4 mr-4"
                    >
                      Apply for new Employee Credential
                    </button>
                  )}
                </div>
              )}
            </TabPanel>
            {showIssuerTab && (
              <TabPanel value="Issue">
                <div className="grid-cols-1 sm:grid md:grid-cols-2 ">
                  {props.pendingApplications.map(
                    (application: CompanyApplication | EmployeeApplication) => (
                      <ApplicationCard
                        key={application._id.toString()}
                        application={application}
                      >
                        {application.status === "pending" ? (
                          <div className="whitespace-nowrap">
                            <button
                              disabled={isProcessing}
                              onClick={() => handleIssuance(application)}
                              className="mr-2 drop-shadow-lg"
                            >
                              Accept
                            </button>
                            <button
                              className="drop-shadow-lg"
                              disabled={isProcessing}
                              onClick={() =>
                                handleRejectApplication(application)
                              }
                            >
                              Reject
                            </button>
                          </div>
                        ) : application.status === "approved" ? (
                          <div>
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-200 text-green-800">
                              Approved
                            </span>
                          </div>
                        ) : (
                          <div>
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium  bg-red-200 text-red-700">
                              Rejected
                            </span>
                          </div>
                        )}
                      </ApplicationCard>
                    ),
                  )}
                </div>
              </TabPanel>
            )}
          </TabsBody>
        </Tabs>
      </div>
      {isProcessing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-white"></div>
        </div>
      )}
    </main>
  );
}

export async function getServerSideProps(
  context: NextPageContext,
): Promise<unknown> {
  const session = await getSession(context);
  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  const registrars = await getRegistrars();
  const isRegistrar = registrars.includes(session.user.pkh);

  const userCredentials = (
    await getWrappedCredentialsFromDb(session.user?.pkh)
  ).map((cred) => ({
    ...cred,
    _id: cred._id.toString(),
  }));
  const companyUserCredentials = await getWrappedCompanyCredentialsFromDb(
    session.user.pkh,
  );

  const isIssuer = companyUserCredentials.length > 0;
  const isEmployee = userCredentials.length - companyUserCredentials.length > 0;

  const pendingOrRejectedUserApplications = (
    await getApplicationsFromDb(session.user.pkh)
  )
    .filter((appl) => appl.status != APPLICATION_STATUS.APPROVED)
    .map((app) => ({
      ...app,
      _id: app._id.toString(),
    }));

  let pendingApplications: Array<CompanyApplication | EmployeeApplication> = [];
  if (isIssuer) {
    const allEmployeeApplications = await getEmployeeApplicationsFromDb();
    pendingApplications = pendingApplications.concat(
      allEmployeeApplications.filter(
        (app) =>
          app.status === APPLICATION_STATUS.PENDING &&
          app.companyAddress === session.user?.pkh,
      ),
    );
  }
  if (isRegistrar) {
    pendingApplications = pendingApplications.concat(
      await getCompanyApplicationsFromDb(),
    );
  }
  pendingApplications = pendingApplications.map((app) => ({
    ...app,
    _id: app._id.toString(),
  }));

  return {
    props: {
      userCredentials,
      userApplications: pendingOrRejectedUserApplications,
      pendingApplications,
      isIssuer,
      isEmployee,
      isRegistrar,
      apiHost: process.env.GLOBAL_SERVER_URL,
    },
  };
}
