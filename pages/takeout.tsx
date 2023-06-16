import React, { useEffect } from "react";
import { getSession, useSession } from "next-auth/react";
import { NextPageContext } from "next";
import {
  getAddressRolesFromDb,
  getCredentialsFromDb,
  getApplicationsFromDb,
  updateApplicationStatusInDb,
} from "../lib/database";
import { dAppClient } from "../config/wallet";
import { SigningType } from "@airgap/beacon-sdk";
import {
  ADDRESS_ROLES,
  APPLICATION_STATUS,
  COLLECTIONS,
} from "@/constants/constants";
import {
  Tab,
  TabPanel,
  Tabs,
  TabsBody,
  TabsHeader,
} from "@material-tailwind/react";
import IssueEmployeeCredentialsTable from "../components/IssueEmployeeCredentialsTable";
import { EmployeeApplication } from "@/types/CompanyApplication";
import { issueEmployeeCredential } from "../lib/credentials";
import axios from "axios";

export default function Takeout(props: any) {
  const { data: session } = useSession();
  const [applications, setApplications] = React.useState<EmployeeApplication[]>(
    props.pendingEmployeeApplications,
  );
  const showIssuerTab = props.coll == COLLECTIONS.TRUSTED_ISSUER_CREDENTIALS;
  console.log(props.coll);

  const downloadCredential = (credential: any) => {
    const data = JSON.stringify(credential);
    const blob = new Blob([data], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "VerifiableCredential.json";
    link.click();
  };

  const transferCredentialToWallet = async () => {
    const signature = await dAppClient!.requestSignPayload({
      signingType: SigningType.RAW,
      payload:
        "Get your GX Credential! #" + props.apiHost + "/api/takeoutCredential",
    });
  };
  const whiteShadow = {
    boxShadow: "0px 0px 10px 3px rgba(255,255,255,0.75)",
  };

  const handleEmployeeIssuance = async (application: EmployeeApplication) => {
    let credential = null;
    try {
      // Issue credential
      credential = await issueEmployeeCredential(application);
      console.log("credential: ", credential);
    } catch (error) {
      console.log("Error issuing credential: ", error);
      return;
    }

    // Update database with credential issuance
    axios
      .post("/api/publishCredential", {
        credential: credential,
        role: "employee",
        applicationKey: application.address + "-" + application.timestamp,
      })
      .then(async function (response) {
        const updatedApplications: any = await getApplicationsFromDb(
          COLLECTIONS.EMPLOYEE_APPLICATIONS,
          session?.user?.pkh,
        );
        setApplications(updatedApplications);
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const handleRejectEmployeeIssuance = async (
    application: EmployeeApplication,
  ) => {
    try {
      // Update database with credential issuance
      await updateApplicationStatusInDb(
        COLLECTIONS.EMPLOYEE_APPLICATIONS,
        application.address + "-" + application.timestamp,
        APPLICATION_STATUS.REJECTED,
      );
      const updatedApplications: any = await getApplicationsFromDb(
        COLLECTIONS.EMPLOYEE_APPLICATIONS,
      );
      setApplications(updatedApplications);
    } catch (error) {
      console.log("Error updating application status: ", error);
    }
  };

  const takeoutCredential = (
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
            <th scope="col" className=" px-6 py-4"></th>
          </tr>
        </thead>
        <tbody className="text-white">
          {props.userCredentials.map((credential: any) => (
            <tr className="border-b border-neutral-500" key={credential.id}>
              <td className="whitespace-nowrap px-6 py-4 font-medium">
                {
                  credential.credentialSubject["gx:legalRegistrationNumber"][
                    "gx:vatID"
                  ]
                }
              </td>
              <td className="whitespace-nowrap  px-6 py-4">
                {credential.credentialSubject["gx:legalName"]}
              </td>
              <td className="whitespace-nowrap  px-6 py-4">
                {credential.credentialSubject.id}
              </td>
              <td className="whitespace-nowrap  px-6 py-4">
                <button onClick={transferCredentialToWallet} className="mr-2">
                  Beacon Wallet
                </button>
                <button onClick={() => downloadCredential(credential)}>
                  Raw Download
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <main className="ml-20 mt-10">
      <div className="flex flex-col w-5/6">
        <Tabs className="" value="Takeout">
          <TabsHeader
            style={{ display: "flex", justifyItems: "center", width: "50%" }}
          >
            <Tab value="Takeout">Takeout</Tab>
            {showIssuerTab && <Tab value="Issue">Issue</Tab>}
          </TabsHeader>
          <TabsBody>
            <TabPanel value="Takeout">{takeoutCredential}</TabPanel>
            {showIssuerTab && (
              <TabPanel value="Issue">
                <IssueEmployeeCredentialsTable
                  props={{
                    applications: applications,
                    handleEmployeeIssuance: handleEmployeeIssuance,
                    handleRejectEmployeeIssuance: handleRejectEmployeeIssuance,
                  }}
                />
              </TabPanel>
            )}
          </TabsBody>
        </Tabs>
      </div>
    </main>
  );
}

export async function getServerSideProps(context: NextPageContext) {
  const session = await getSession(context);
  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  const addressRole: any = await getAddressRolesFromDb(session.user!.pkh);
  const role = Array.isArray(addressRole)
    ? addressRole[0].role
    : addressRole.role;
  let coll = "";
  if (role === ADDRESS_ROLES.COMPANY_APPROVED) {
    coll = COLLECTIONS.TRUSTED_ISSUER_CREDENTIALS;
  } else if (role === ADDRESS_ROLES.EMPLOYEE_APPROVED) {
    coll = COLLECTIONS.TRUSTED_EMPLOYEE_CREDENTIALS;
  } else {
    return {
      redirect: {
        destination: "/common/unauthorized",
        permanent: false,
      },
    };
  }

  return {
    props: {
      userCredentials: (
        await getCredentialsFromDb(coll, session.user!.pkh)
      ).map((wrapper) => wrapper.credential),
      pendingEmployeeApplications: await getApplicationsFromDb(
        COLLECTIONS.EMPLOYEE_APPLICATIONS,
        session.user!.pkh,
      ),
      coll,
      apiHost: process.env.GLOBAL_SERVER_URL,
    },
  };
}
