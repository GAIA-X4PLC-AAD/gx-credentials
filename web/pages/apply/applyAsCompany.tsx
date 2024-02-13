/*
 * Copyright (C) 2023, Software Engineering for Business Information Systems (sebis) <matthes@tum.de>
 * SPDX-License-Identifier: Apache-2.0
 */
import React, { useState } from "react";
import { getSession, useSession } from "next-auth/react";
import { NextPageContext } from "next";
import axios from "axios";
import { useRouter } from "next/router";

export default function ApplyAsCompany(): JSX.Element {
  const { data: session } = useSession();
  const router = useRouter();

  const [legalName, setName] = useState<string>("");
  const [registrationNumber, setNumber] = useState<string>("");
  const [headquarterAddress, setHeadquarterAddress] = useState<string>("");
  const [legalAddress, setLegalAddress] = useState<string>("");
  const [parentOrganization, setParent] = useState<string>("");
  const [subOrganization, setSub] = useState<string>("");

  const [applicationText, setDescription] = useState<string>("");

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = (e: { preventDefault: () => void }): void => {
    e.preventDefault(); // avoid default behaviour
    setIsLoading(true); // Set loading state to true

    axios
      .post("/api/applyAsCompany", {
        legalName,
        registrationNumber,
        headquarterAddress,
        legalAddress,
        parentOrganization,
        subOrganization,
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
            Tezos Address
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
            Full Legal Name
          </label>
        </div>
        <div className="md:w-3/4">
          <input
            className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
            id="inline-full-name"
            type="text"
            onChange={(e) => setName(e.target.value)}
          />
        </div>
      </div>

      <div className="md:flex md:items-center mb-6">
        <div className="md:w-1/4">
          <label
            className="block text-gray-200 font-bold md:text-left mb-1 md:mb-0 pr-4"
            htmlFor="inline-gx-id"
          >
            Registration Number
          </label>
        </div>
        <div className="md:w-3/4">
          <input
            className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
            id="inline-gx-id"
            type="text"
            onChange={(e) => setNumber(e.target.value)}
          />
        </div>
      </div>

      <div className="md:flex md:items-center mb-6">
        <div className="md:w-1/4">
          <label
            className="block text-gray-200 font-bold md:text-left mb-1 md:mb-0 pr-4"
            htmlFor="inline-hq"
          >
            Headquarter Address Code
          </label>
        </div>
        <div className="md:w-3/4">
          <input
            className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
            id="inline-hq"
            type="text"
            onChange={(e) => setHeadquarterAddress(e.target.value)}
          />
        </div>
      </div>

      <div className="md:flex md:items-center mb-6">
        <div className="md:w-1/4">
          <label
            className="block text-gray-200 font-bold md:text-left mb-1 md:mb-0 pr-4"
            htmlFor="inline-legal-address"
          >
            Legal Address Code
          </label>
        </div>
        <div className="md:w-3/4">
          <input
            className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
            id="inline-legal-address"
            type="text"
            onChange={(e) => setLegalAddress(e.target.value)}
          />
        </div>
      </div>

      <div className="md:flex md:items-center mb-6">
        <div className="md:w-1/4">
          <label
            className="block text-gray-200 font-bold md:text-left mb-1 md:mb-0 pr-4"
            htmlFor="inline-parent"
          >
            Parent Organization
          </label>
        </div>
        <div className="md:w-3/4">
          <input
            className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
            id="inline-parent"
            type="text"
            onChange={(e) => setParent(e.target.value)}
          />
        </div>
      </div>

      <div className="md:flex md:items-center mb-6">
        <div className="md:w-1/4">
          <label
            className="block text-gray-200 font-bold md:text-left mb-1 md:mb-0 pr-4"
            htmlFor="inline-sub"
          >
            Sub Organization
          </label>
        </div>
        <div className="md:w-3/4">
          <input
            className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
            id="inline-sub"
            type="text"
            onChange={(e) => setSub(e.target.value)}
          />
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
          <button disabled={isLoading}>Apply for Company Registration</button>
        </div>
      </div>
    </form>
  );

  return (
    <div className="relative flex justify-center min-h-screen">
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-white"></div>
        </div>
      )}
      <main className="md:w-2/4 mt-10">
        <h1>Register Your Company</h1>
        <p className="mb-4">
          Registering your company here will allow you to issue employee
          credentials to your employees that are trusted by all other members of
          this consortium. For convenience, issuers can optionally use this web
          application to handle the process of issuing employee credentials.
        </p>
        <div>{form}</div>
      </main>
    </div>
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
  return {
    props: {},
  };
}
