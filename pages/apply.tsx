import React from "react";
import { getSession, useSession } from "next-auth/react";
import { NextPageContext } from "next";
import Link from "next/link";
import { useProtected } from "../hooks/useProtected";

export default function Apply() {
  const handleSignout = useProtected();
  const { data: session } = useSession();

  return (
    <main className="ml-20 mt-10">
      <h1>Apply for Credentials</h1>
      <div>{session?.user?.pkh}</div>
      <button>
        <Link href="/apply/applyAsCompany">Apply as Company</Link>
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
  return {
    props: {},
  };
}
