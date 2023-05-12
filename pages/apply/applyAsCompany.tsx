import React, { useState } from "react";
import { getSession, useSession } from "next-auth/react";
import { NextPageContext } from "next";
import { useProtected } from "../../hooks/useProtected";
import axios from "axios";

export default function Apply() {
  const handleSignout = useProtected();
  const { data: session } = useSession();

  const [name, setName] = useState<string>("");
  const [gx_id, setGX_ID] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault(); // avoid default behaviour

    axios
      .post("/api/applyAsCompany", {
        name: name,
        gx_id: gx_id,
        description: description,
      })
      .then(function (response) {
        // TODO redirect
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  return (
    <main className="ml-20 mt-10">
      <h1>Register Your Company</h1>
      <form className="w-full max-w-xl" onSubmit={handleSubmit}>
        <div className="md:flex md:items-center mb-6">
          <div className="md:w-1/3">
            <label
              className="block text-gray-200 font-bold md:text-right mb-1 md:mb-0 pr-4"
              htmlFor="inline-full-name"
            >
              Full Name
            </label>
          </div>
          <div className="md:w-2/3">
            <input
              className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
              id="inline-full-name"
              type="text"
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        </div>

        <div className="md:flex md:items-center mb-6">
          <div className="md:w-1/3">
            <label
              className="block text-gray-200 font-bold md:text-right mb-1 md:mb-0 pr-4"
              htmlFor="inline-gx-id"
            >
              GX ID
            </label>
          </div>
          <div className="md:w-2/3">
            <input
              className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
              id="inline-gx-id"
              type="text"
              onChange={(e) => setGX_ID(e.target.value)}
            />
          </div>
        </div>

        <div className="md:flex md:items-center mb-6">
          <div className="md:w-1/3">
            <label
              className="block text-gray-200 font-bold md:text-right mb-1 md:mb-0 pr-4"
              htmlFor="inline-description"
            >
              Description
            </label>
          </div>
          <div className="md:w-2/3">
            <textarea
              className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
              id="inline-description"
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </div>

        <div className="md:flex md:items-center mb-6">
          <div className="md:w-1/3">
            <label
              className="block text-gray-200 font-bold md:text-right mb-1 md:mb-0 pr-4"
              htmlFor="inline-gx-id"
            >
              Address
            </label>
          </div>
          <div className="md:w-2/3">
            <input
              className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
              id="inline-gx-id"
              type="text"
              value={session?.user?.pkh}
              readOnly
            />
          </div>
        </div>

        <div className="md:flex md:items-center">
          <div className="md:w-1/3"></div>
          <div className="md:w-2/3">
            <button>Sign Up</button>
          </div>
        </div>
      </form>

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
    props: {},
  };
}
