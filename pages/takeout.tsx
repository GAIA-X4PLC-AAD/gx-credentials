import React from "react";
import { getSession, useSession } from "next-auth/react";
import { NextPageContext } from "next";
import { useProtected } from "../hooks/useProtected";
import { getIssuerCredentials } from "../lib/database";
import { dAppClient } from "../config/wallet";
import { SigningType } from "@airgap/beacon-sdk";

export default function Takeout(props: any) {
  const handleSignout = useProtected();
  const { data: session } = useSession();

  const downloadCredential = (credential) => {
    const data = JSON.stringify(credential);
    const blob = new Blob([data], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "VerifiableCredential.json";
    link.click();
  };

  const transferCredentialToWallet = async (credential) => {
    const signature = await dAppClient!.requestSignPayload({
      signingType: SigningType.RAW,
      payload:
        "Get your GX Credential! #" + props.apiHost + "/api/takeoutCredential",
    });
  };

  return (
    <main className="ml-20 mt-10">
      <h1>
        Hello <b className="text-blue-500">{session?.user?.pkh}</b>!
      </h1>

      <div className="flex flex-col w-5/6">
        <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
            <div className="overflow-hidden">
              <table className="min-w-full text-center text-sm font-light">
                <thead className="border-b bg-neutral-50 font-medium border-neutral-500 text-neutral-800">
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
                <tbody>
                  {props.userCredentials.map((credential: any) => (
                    <tr
                      className="border-b border-neutral-500"
                      key={credential.id}
                    >
                      <td className="whitespace-nowrap  px-6 py-4 font-medium">
                        {
                          credential.credentialSubject[
                            "gx:legalRegistrationNumber"
                          ]["gx:vatID"]
                        }
                      </td>
                      <td className="whitespace-nowrap  px-6 py-4">
                        {credential.credentialSubject["gx:legalName"]}
                      </td>
                      <td className="whitespace-nowrap  px-6 py-4">
                        {credential.credentialSubject.id}
                      </td>
                      <td className="whitespace-nowrap  px-6 py-4">
                        <button
                          onClick={() => transferCredentialToWallet(credential)}
                          className="mr-2"
                        >
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
          </div>
        </div>
      </div>

      <button>Load into Altme Wallet</button>
      <button>Raw File Download</button>
      <button onClick={handleSignout}>Logout</button>
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

  return {
    props: {
      userCredentials: (await getIssuerCredentials(session.user!.pkh)).map(
        (wrapper) => wrapper.credential
      ),
      apiHost: process.env.GLOBAL_SERVER_URL,
    },
  };
}