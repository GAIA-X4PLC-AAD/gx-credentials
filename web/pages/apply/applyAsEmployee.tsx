/*
 * Copyright (C) 2023, Software Engineering for Business Information Systems (sebis) <matthes@tum.de>
 * SPDX-License-Identifier: Apache-2.0
 */
import React, { useEffect, useState } from "react";
import { getSession, useSession } from "next-auth/react";
import { NextPageContext } from "next";
import axios from "axios";
import { getTrustedIssuersFromDb } from "@/lib/database";
import { useRouter } from "next/router";

export default function ApplyAsEmployee(props: any) {
  const { data: session } = useSession();

  const [legalName, setName] = useState<string>("");
  const [role, setRole] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [applicationText, setDescription] = useState<string>("");
  const [companyAddress, setCompanyId] = useState<string>("");
  const [companies, setCompanies] = useState([]);
  const [companyName, setCompanyName] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    setCompanies(props.issuers);
  }, [props.issuers]);

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault(); // avoid default behaviour
    axios
      .post("/api/applyAsEmployee", {
        legalName,
        role,
        email,
        companyAddress,
        companyName,
        applicationText,
      })
      .then(function (response) {
        console.log(response);
      })
      .then(() => {
        router.push("/common/pending");
      })
      .catch(function (error) {
        console.log(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const form = (
    <form className="w-full max-w-xl" onSubmit={handleSubmit}>
      <div className="md:flex md:items-center mb-6">
        <div className="md:w-1/4">
          <label
            className="block text-gray-200 font-bold md:text-left mb-1 md:mb-0 pr-4"
            htmlFor="inline-gx-id"
          >
            Address
          </label>
        </div>
        <div className="md:w-3/4">
          <input
            className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
            id="inline-gx-id"
            type="text"
            value={session?.user?.pkh}
            readOnly
          />
        </div>
      </div>
      <div className="md:flex md:items-center mb-6">
        <div className="md:w-1/4">
          <label
            className="block text-gray-200 font-bold md:text-left mb-1 md:mb-0 pr-4"
            htmlFor="inline-full-name"
          >
            Full Name
          </label>
        </div>
        <div className="md:w-3/4">
          <input
            className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
            id="inline-full-name"
            type="text"
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
      </div>
      <div className="md:flex md:items-center mb-6">
        <div className="md:w-1/4">
          <label
            className="block text-gray-200 font-bold md:text-left mb-1 md:mb-0 pr-4"
            htmlFor="inline-role"
          >
            Role
          </label>
        </div>
        <div className="md:w-3/4">
          <input
            className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
            id="inline-full-name"
            type="text"
            onChange={(e) => setRole(e.target.value)}
            required
          />
        </div>
      </div>
      <div className="md:flex md:items-center mb-6">
        <div className="md:w-1/4">
          <label
            className="block text-gray-200 font-bold md:text-left mb-1 md:mb-0 pr-4"
            htmlFor="inline-role"
          >
            Email
          </label>
        </div>
        <div className="md:w-3/4">
          <input
            className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
            id="inline-full-name"
            type="text"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
      </div>
      <div className="md:flex md:items-center mb-6">
        <div className="md:w-1/4">
          <label
            className="block text-gray-200 font-bold md:text-left mb-1 md:mb-0 pr-4"
            htmlFor="inline-description"
          >
            CompanyName
          </label>
        </div>
        <div className="md:w-3/4">
          <select
            className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
            value={companyName}
            onChange={(e) => {
              console.log(e.target.value);
              setCompanyName(e.target.value);

              for (let i = 0; i < Array.from(companies).length; i++) {
                const company = companies[i];
                console.log(company);
                if (company[0] == e.target.value) {
                  setCompanyId(company[1]);
                  break;
                }
              }
            }}
            required
          >
            <option value="" disabled>
              Select a company
            </option>
            {companies.map((company) => (
              <option key={company[1]} value={company[0]}>
                {company[0]}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="md:flex md:items-center mb-6">
        <div className="md:w-1/4">
          <label
            className="block text-gray-200 font-bold md:text-left mb-1 md:mb-0 pr-4"
            htmlFor="inline-description"
          >
            Application Text
          </label>
        </div>
        <div className="md:w-3/4">
          <textarea
            className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
            id="inline-description"
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
      </div>

      <div className="md:flex md:items-center mb-6">
        <div className="md:w-1/4"></div>
        <div className="md:w-3/4">
          <button disabled={isLoading}>Apply for Employee Registration</button>
        </div>
      </div>
    </form>
  );

  return (
    <div className="flex justify-center min-h-screen">
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-white"></div>
        </div>
      )}
      <main className="md:w-2/4 mt-10">
        <h1>Register as an Employee</h1>
        <p className="mb-4">
          Register as an Employee for one of the registered companies.
        </p>
        {form}
      </main>
    </div>
  );
}

export async function getServerSideProps(context: NextPageContext) {
  const session = await getSession(context);
  console.log("session", session);
  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
  const issuers = await getTrustedIssuersFromDb();
  console.log(issuers);
  const issuerList = Array.from(issuers.entries());
  return {
    props: {
      issuers: issuerList,
    },
  };
}
