import React from "react";
import { getSession, useSession } from "next-auth/react";
import { NextPageContext } from "next";
import { useProtected } from "../hooks/useProtected";

export default function Apply() {
  const handleSignout = useProtected();
  const { data: session } = useSession();

  return (
    <main>
      <h1>Apply for Credentials</h1>
      <div>{session?.user?.pkh}</div>
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
