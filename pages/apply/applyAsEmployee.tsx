import React, { useEffect, useState } from "react";
import { getSession, useSession } from "next-auth/react";
import { NextPageContext } from "next";
import { useProtected } from "../../hooks/useProtected";
import axios from "axios";
import { getTrustedIssuers } from "@/lib/database";

export default function ApplyAsEmployee() {
  const handleSignout = useProtected();
  const { data: session } = useSession();

  const [name, setName] = useState<string>("");
  const [employeeId, setEmployeeId] = useState<string>("");
  const [companyId, setCompanyId] = useState<string>("");
  const [companies, setCompanies] = useState(new Map());
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [companyName, setCompanyName] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      const issuers = await getTrustedIssuers();
      setCompanies(issuers);
    };

    fetchData();
  }, []);

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault(); // avoid default behaviour
    axios
      .post("/api/applyAsEmployee", {
        name: name,
        employeeId: employeeId,
        companyId: companyId,
        companyName: companyName,
      })
      .then(function (response) {
        setSubmitted(true);
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const form = (
    <form className="w-full max-w-xl" onSubmit={handleSubmit}>
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
          />
        </div>
      </div>
      <div className="md:flex md:items-center mb-6">
        <div className="md:w-1/4">
          <label
            className="block text-gray-200 font-bold  md:text-left mb-1 md:mb-0 pr-4"
            htmlFor="inline-gx-id"
          >
            Employee ID
          </label>
        </div>
        <div className="md:w-3/4">
          <input
            className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
            id="inline-gx-id"
            type="text"
            value={employeeId}
            onChange={(e) => setEmployeeId(e.target.value)}
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
              setCompanyName(e.target.value);
              setCompanyId(companies.get(e.target.value));
            }}
          >
            {Array.from(companies.keys()).map((key) => (
              <option key={key} value={key}>
                {key}
              </option>
            ))}
          </select>
        </div>
      </div>
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
        <div className="md:w-1/4"></div>
        <div className="md:w-3/4">
          <button>Apply for Employee Registration</button>
        </div>
      </div>
    </form>
  );

  const submissionConfirmation = (
    <div>
      <b>Thank you for submitting your request.</b>
    </div>
  );

  return (
    <div className="flex justify-center min-h-screen">
      <main className="md:w-2/4 mt-10">
        <h1>Register as an Employee</h1>
        <p className="mb-4">
          Register as an Employee for one of the registered companies.
        </p>
        <div>
          {submitted ? submissionConfirmation : form}

          <button onClick={handleSignout}>Logout</button>
        </div>
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
  return {
    props: {},
  };
}