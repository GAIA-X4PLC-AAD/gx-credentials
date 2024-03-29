/*
 * Copyright (C) 2023, Software Engineering for Business Information Systems (sebis) <matthes@tum.de>
 * SPDX-License-Identifier: Apache-2.0
 */
import { signIn } from "next-auth/react";
import { requestRequiredPermissions, dAppClient } from "../config/wallet";
import { useEffect } from "react";
import { RequestSignPayloadInput, SigningType } from "@airgap/beacon-sdk";
import { payloadBytesFromString } from "../lib/payload";

export default function Home() {
  useEffect(() => {
    const animateElements = () => {
      const gxElement = document.getElementById("gx-text");
      const buttonElement = document.getElementById("login-button");

      if (gxElement) {
        gxElement.classList.remove("-translate-y-52");
        gxElement.classList.add("translate-y-0");
      }

      if (buttonElement) {
        buttonElement.classList.remove("translate-y-52");
        buttonElement.classList.add("-translate-y-0");
      }
    };

    setTimeout(() => {
      animateElements();
    }, 500);
  }, []);

  const handleLogin = async () => {
    try {
      const callbackUrl = "/apply";
      const activeAccount = await dAppClient?.getActiveAccount();
      let activeAddress;
      let activePk;
      if (activeAccount) {
        console.log("Already connected:", activeAccount.address);
        activeAddress = activeAccount.address;
        activePk = activeAccount.publicKey;
      } else {
        const permissions = await requestRequiredPermissions();
        console.log("New connection:", permissions.address);
        activeAddress = permissions.address;
        activePk = permissions.publicKey;
      }

      // refer to https://tezostaquito.io/docs/signing/#generating-a-signature-with-beacon-sdk
      const dappUrl = "gx-credentials.example.com";
      const ISO8601formatedTimestamp = new Date().toISOString();
      const input = "GX Credentials Login";
      const formattedInput: string = [
        "Tezos Signed Message:",
        dappUrl,
        ISO8601formatedTimestamp,
        input,
      ].join(" ");

      const payloadBytes = payloadBytesFromString(formattedInput);

      const payload: RequestSignPayloadInput = {
        signingType: SigningType.MICHELINE,
        payload: payloadBytes,
        sourceAddress: activeAddress,
      };
      const response = await dAppClient!.requestSignPayload(payload);

      signIn("credentials", {
        pkh: activeAddress,
        pk: activePk,
        formattedInput,
        signature: response.signature,
        callbackUrl,
      });
    } catch (error) {
      window.alert(error);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
        <p>This is experimental software. Use with caution!</p>
        <div className="fixed bottom-0 left-0 flex h-48 w-full items-end justify-center bg-gradient-to-t from-white via-white dark:from-black dark:via-black lg:static lg:h-auto lg:w-auto lg:bg-none">
          <a
            className="pointer-events-none flex place-items-center gap-2 p-8 lg:pointer-events-auto lg:p-0"
            href="https://wwwmatthes.in.tum.de/pages/t5ma0jrv6q7k/sebis-Public-Website-Home"
            target="_blank"
            rel="noopener noreferrer"
          >
            By sebis @ TUM
          </a>
        </div>
      </div>

      {/* <div className="flex flex-col place-items-center before:absolute before:h-[300px] before:w-[480px] before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-[240px] after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700/10 after:dark:from-sky-900 after:dark:via-[#0141ff]/40 before:lg:h-[360px]"> */}
      <div className="flex flex-col place-items-center overflow-hidden">
        <div>
          <h1
            id="gx-text"
            className="text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600 transition duration-500 ease-in-out transform -translate-y-full"
          >
            GX Credentials
          </h1>
        </div>
        <div className="w-full flex align-center justify-center">
          <button
            id="login-button"
            className="text-lg w-2/4 hover:bg-gray-100 font-semibold py-2 px-2 border border-gray-500 hover:border-transparent rounded"
            onClick={handleLogin}
          >
            Login
          </button>
        </div>
      </div>

      <div className="mb-32 grid text-center lg:mb-0 lg:grid-cols-4 lg:text-left">
        {/*TODO add some more informative content here later on*/}
        &nbsp;
      </div>
    </main>
  );
}
