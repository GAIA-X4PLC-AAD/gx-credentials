"use client";

import { ReaderIcon } from "@radix-ui/react-icons";
import { Outlet, useLocation } from "react-router";

import { Separator } from "@/components/ui/separator";
import { useSession } from "@/hooks/use-session";

const ApplyWrapper = () => {
  const { status } = useSession();
  const { pathname } = useLocation();
  const type = pathname.split("/")[2];

  if (status === "loading") {
    return <div className="space-y-4 py-8">Loading...</div>;
  }
  return (
    <div className="animate-appear min-h-[80vh] space-y-4 py-8">
      <h1 className="text-3xl font-bold">
        <ReaderIcon className="mr-2 mb-1 inline-block h-7 w-7" />
        Application
      </h1>
      {type && (
        <>
          <p>
            Request a <b>{type}</b> credential.{" "}
          </p>
          <p className="text-sm text-muted-foreground">
            {type === "company" &&
              "Registering your company here will allow you to issue employee credentials to your employees that are trusted by all other members of this consortium. For convenience, issuers can optionally use this web application to handle the process of issuing employee credentials."}
          </p>
        </>
      )}
      <Separator className="my-4 w-full" />
      <Outlet />
    </div>
  );
};

export default ApplyWrapper;
