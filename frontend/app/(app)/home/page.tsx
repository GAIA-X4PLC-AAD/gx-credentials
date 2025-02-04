"use client";

import LoginButton from "@/components/LoginButton";
import { Button } from "@/components/ui/button";
import { logout } from "@/lib/actions/auth";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

const Page = () => {
  const { data: session, status } = useSession();

  // Force re-render on status change
  useEffect(() => {}, [status]);

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  return (
    <div className="py-8 space-y-4">
      <h1 className="text-3xl">Welcome back!</h1>
      <Separator className="w-full" />
      {status === "authenticated" && session ? (
        <>
          <pre>{JSON.stringify(session, null, 2)}</pre>
          <Button onClick={() => logout()}>Log out</Button>
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
