import React from "react";
import { getSession, useSession } from "next-auth/react";
import { NextPageContext } from "next";
import Link from "next/link";
import { useProtected } from "../hooks/useProtected";
import { getRegistrars } from "../lib/registryInteraction";
import { getCredentialsFromDb } from "../lib/database";
import { COLLECTIONS } from "@/constants/constants";

export default function Apply() {
  const handleSignout = useProtected();
  const { data: session } = useSession();

  return (
    <main className="ml-20 mt-10">
      <p>
        You are still unknown to our system. Do you wish to apply for a specific
        credential?
      </p>
      <button>
        <Link href="/apply/applyAsCompany">Apply as Company</Link>
      </button>
      <button>
        <Link href="/apply/applyAsEmployee">Apply as Employee</Link>
      </button>
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
  if (registrars.includes(session.user.pkh)) {
    return {
      redirect: {
        destination: "/issueCompany",
        permanent: false,
      },
    };
  }

  // TODO should first redirect to issuance page for companies with optional link to cred takeout
  const userIssuerCredentials = await getCredentialsFromDb(
    session.user.pkh,
    COLLECTIONS.TRUSTED_ISSUER_CREDENTIALS,
  );
  if (userIssuerCredentials.length > 0) {
    return {
      redirect: {
        destination: "/takeout",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
}
