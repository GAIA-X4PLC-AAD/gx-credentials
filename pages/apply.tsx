import React from "react";
import { getSession, useSession } from "next-auth/react";
import { NextPageContext } from "next";
import Link from "next/link";
import { useProtected } from "../hooks/useProtected";
import { getRegistrars } from "../lib/registryReader";

export default function Apply() {
  const handleSignout = useProtected();
  const { data: session } = useSession();

  return (
    <main className="ml-20 mt-10">
      <h1>
        Hello <b className="text-blue-500">{session?.user?.pkh}</b>!
      </h1>
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

  const registrars = await getRegistrars();
  if (registrars.includes(session.user.pkh)) {
    return {
      redirect: {
        destination: "/issue",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
}
