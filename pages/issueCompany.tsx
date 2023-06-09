import React from "react";
import { getSession, useSession } from "next-auth/react";
import { NextPageContext } from "next";
import { useProtected } from "../hooks/useProtected";
import { db } from "../config/firebase";
import { collection, query, where, getDocs } from "firebase/firestore/lite";
import { issueCompanyCredential } from "../lib/credentials";
import { CompanyApplication } from "@/types/CompanyApplication";
import axios from "axios";
import { useRouter } from "next/router";
import {
  getRegistrars,
  writeTrustedIssuerLog,
} from "@/lib/registryInteraction";
import {
  getPendingApplications,
  getPendingCompanyApplications,
} from "@/lib/database";

export default function Issue(props: any) {
  const router = useRouter();

  function delay(milliseconds: number) {
    return new Promise((resolve) => {
      setTimeout(resolve, milliseconds);
    });
  }

  const handleCompanyIssuance = async (application: CompanyApplication) => {
    let credential = null;
    try {
      // Issue credential
      credential = await issueCompanyCredential(application);
      console.log("credential: ", credential);
    } catch (error) {
      console.log("Error issuing credential: ", error);
      return;
    }

    await delay(2000);

    try {
      // Publish credential to issuer registry
      await writeTrustedIssuerLog(application.address);
    } catch (error) {
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
      .then(function (response) {
        router.reload();
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  return (
    <main className="ml-20 mt-10">
      <h2>Pending Company Applications</h2>
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
                    <th scope="col" className=" px-6 py-4">
                      Description
                    </th>
                    <th scope="col" className=" px-6 py-4"></th>
                  </tr>
                </thead>
                <tbody>
                  {props.pendingCompanyApplications.map((application: any) => (
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
                      <td className="whitespace-nowrap  px-6 py-4">
                        <button
                          onClick={() => handleCompanyIssuance(application)}
                          className="mr-2"
                        >
                          Accept
                        </button>
                        <button>Reject</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
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

  const registrars = await getRegistrars();
  if (!registrars.includes(session.user?.pkh)) {
    return {
      redirect: {
        destination: "/unauthorised",
        permanent: false,
      },
    };
  }

  return {
    props: {
      pendingCompanyApplications: getPendingApplications("CompanyApplications"),
    },
  };
}
