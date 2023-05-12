import React from "react";
import { getSession, useSession } from "next-auth/react";
import { NextPageContext } from "next";
import Link from "next/link";
import { useProtected } from "../hooks/useProtected";
import { db } from "../config/firebase";
import { collection, query, where, getDocs } from "firebase/firestore/lite";

export default function Issue(props: any) {
  const handleSignout = useProtected();
  const { data: session } = useSession();

  return (
    <main className="ml-20 mt-10">
      <h1>
        Hello <b className="text-blue-500">{session?.user?.pkh}</b>!
      </h1>

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
                        <button className="mr-2">Accept</button>
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
    collection(db, "CompanyApplications"),
    where("status", "==", "pending")
  );
  const querySnapshot = await getDocs(q);

  return {
    props: {
      pendingCompanyApplications: querySnapshot.docs.map((doc) => doc.data()),
    },
  };
}
