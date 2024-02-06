/*
 * Copyright (C) 2023, Software Engineering for Business Information Systems (sebis) <matthes@tum.de>
 * SPDX-License-Identifier: Apache-2.0
 */
import React from "react";
import { getSession } from "next-auth/react";
import { NextPageContext } from "next";
import Link from "next/link";
import { getRegistrars } from "../lib/registryInteraction";
import {
  getTrustedIssuersFromDb,
  getCredentialsFromDb,
  getApplicationsFromDb,
  userHasCredentialOrApplication
} from "@/lib/database";
import { APPLICATION_STATUS, COLLECTIONS } from "@/constants/constants";

export default function Apply() {
  return (
    <main className="h-screen flex flex-col align-center">
      <div className="flex justify-center">
        <p>
          You are still unknown to our system. Do you wish to apply for a
          specific credential?
        </p>
      </div>
      <div className="flex justify-center">
        <button className="m-2">
          <Link href="/apply/applyAsCompany">Apply as Company</Link>
        </button>
        <button className="m-2">
          <Link href="/apply/applyAsEmployee">Apply as Employee</Link>
        </button>
      </div>
    </main>
  );
}

export async function getServerSideProps(context: NextPageContext) {
  const session = await getSession(context);
  if (!session) {
    console.log("No session found.");
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  // user is a registrar
  const registrars = await getRegistrars();
  if (registrars.includes(session.user.pkh)) {
    return {
      redirect: {
        destination: "/issue",
        permanent: false,
      },
    };
  }

  // user has at least one credential or application
  const isKnownUser = await userHasCredentialOrApplication(session.user.pkh);
  if (registrars.includes(session.user.pkh)) {
    return {
      redirect: {
        destination: "/takeout",
        permanent: false,
      },
    };
  }

  // every other user should apply
  return {};
}
