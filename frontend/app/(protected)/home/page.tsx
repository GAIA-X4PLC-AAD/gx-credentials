"use client";

import ApplyCard from "@/components/cards/apply-card";
import LoginButton from "@/components/LoginButton";
import { Separator } from "@/components/ui/separator";
import { useSession } from "next-auth/react";

const Page = () => {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div className="py-8 space-y-4">Loading...</div>;
  }

  return (
    <div className="py-8 space-y-4">
      <h1 className="text-3xl">Welcome back!</h1>
      <p>Manage credentials and applications here.</p>
      <Separator className="w-full my-4" />
      <div className="flex space-x-4">
        {(["company", "employee"] as const).map((type) => (
          <ApplyCard key={type} type={type} />
        ))}
        {}
      </div>
      {status === "authenticated" && session !== null ? (
        <>
          <pre>{JSON.stringify(session, null, 2)}</pre>
        </>
      ) : (
        <p>
          You are not authenticated. <LoginButton />
        </p>
      )}
    </div>
  );
};

export default Page;
