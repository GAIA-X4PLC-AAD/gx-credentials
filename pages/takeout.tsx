import React, { useEffect } from "react";
import { getSession, useSession } from "next-auth/react";
import { NextPageContext } from "next";
import { getAddressRolesFromDb, getCredentialsFromDb } from "../lib/database";
import { dAppClient } from "../config/wallet";
import { SigningType } from "@airgap/beacon-sdk";
import { ADDRESS_ROLES, COLLECTIONS } from "@/constants/constants";
import {
  Tab,
  TabPanel,
  Tabs,
  TabsBody,
  TabsHeader,
} from "@material-tailwind/react";
import IssueEmployee from "../components/issueEmployee";

export default function Takeout(props: any) {
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
            {props.coll !== COLLECTIONS.TRUSTED_ISSUER_CREDENTIALS && (
              <Tab value="Issue">Issue</Tab>
            )}
          </TabsHeader>
          <TabsBody>
            <TabPanel value="Takeout">{takeoutCredential}</TabPanel>
            {props.coll === COLLECTIONS.TRUSTED_ISSUER_CREDENTIALS && (
              <TabPanel value="Issue">
                <IssueEmployee />
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
  console.log("DSS: ", addressRole);

  const role = addressRole
    ? Array.isArray(addressRole)
      ? addressRole[0].role
      : addressRole.role
    : null;
  let coll = "";
  if (role === ADDRESS_ROLES.COMPANY_APPROVED) {
    coll = COLLECTIONS.TRUSTED_ISSUER_CREDENTIALS;
  } else if (role === ADDRESS_ROLES.EMPLOYEE_APPROVED) {
    coll = COLLECTIONS.TRUSTED_EMPLOYEE_CREDENTIALS;
  } else {
    return {
      redirect: {
        destination: "/common/unauthorised",
        permanent: false,
      },
    };
  }

  return {
    props: {
      userCredentials: (
        await getCredentialsFromDb(coll, session.user!.pkh)
      ).map((wrapper) => wrapper.credential),
      apiHost: process.env.GLOBAL_SERVER_URL,
    },
  };
}
