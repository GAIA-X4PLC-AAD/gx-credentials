import React from "react";
import { getSession, useSession } from "next-auth/react";
import { NextPageContext } from "next";
import { useProtected } from "../hooks/useProtected";
import { db } from "../config/firebase";
import { collection, query, where, getDocs } from "firebase/firestore/lite";
import {
  issueCompanyCredential,
  issueEmployeeCredential,
} from "../lib/credentials";
import {
  CompanyApplication,
  EmployeeApplication,
} from "@/types/CompanyApplication";
import axios from "axios";
import { useRouter } from "next/router";
import { writeTrustedIssuerLog } from "@/lib/registryInteraction";

export default function Issue(props: any) {
  const handleSignout = useProtected();
  const { data: session } = useSession();
  const router = useRouter();

  function delay(milliseconds: number) {
    return new Promise((resolve) => {
      setTimeout(resolve, milliseconds);
    });
  }

  const handleEmmployeeIssuance = async (application: EmployeeApplication) => {
    let credential = null;
    try {
      // Issue credential
      credential = await issueEmployeeCredential(application);
      console.log("credential: ", credential);
    } catch (error) {
      console.log("Error issuing credential: ", error);
      return;
    }

    await delay(2000);

    // try {
    //   // Publish credential to issuer registry
    //   await writeTrustedIssuerLog(application.address);
    // } catch (error) {
    //   console.log("Error publishing credential to issuer registry: ", error);
    //   return;
    // }

    // Update database with credential issuance
    axios
      .post("/api/publishCredential", {
        credential: credential,
        role: "employee",
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
      <h1>
        Hello <b className="text-blue-500">{session?.user?.pkh}</b>!
      </h1>

      <h2>Pending Employee Applications</h2>
      <div className="flex flex-col w-5/6">
        <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
            <div className="overflow-hidden">
              <table className="min-w-full text-center text-sm font-light">
                <thead className="border-b bg-neutral-50 font-medium border-neutral-500 text-neutral-800">
                  <tr>
                    <th scope="col" className=" px-6 py-4">
                      Employee Id
                    </th>
                    <th scope="col" className=" px-6 py-4">
                      Employee Name
                    </th>
                    <th scope="col" className=" px-6 py-4">
                      Company Name
                    </th>
                    <th scope="col" className=" px-6 py-4">
                      Address
                    </th>
                    <th scope="col" className=" px-6 py-4"></th>
                  </tr>
                </thead>
                <tbody>
                  {props.pendingEmployeeApplications.map((application: any) => (
                    <tr
                      className="border-b border-neutral-500"
                      key={application.address}
                    >
                      <td className="whitespace-nowrap  px-6 py-4 font-medium">
                        {application.employeeId}
                      </td>
                      <td className="whitespace-nowrap  px-6 py-4">
                        {application.name}
                      </td>
                      <td className="whitespace-nowrap  px-6 py-4">
                        {application.companyName}
                      </td>
                      <td className="whitespace-nowrap  px-6 py-4">
                        {application.address}
                      </td>
                      <td className="whitespace-nowrap  px-6 py-4">
                        <button
                          onClick={() => handleEmmployeeIssuance(application)}
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

  const q = query(
    collection(db, "EmployeeApplications"),
    where("status", "==", "pending"),
  );
  const querySnapshot = await getDocs(q);

  return {
    props: {
      pendingEmployeeApplications: querySnapshot.docs.map((doc) => doc.data()),
    },
  };
}
