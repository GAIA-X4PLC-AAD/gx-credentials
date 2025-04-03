"use client";

import { Separator } from "@/components/ui/separator";
import { ReaderIcon } from "@radix-ui/react-icons";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { status } = useSession();
  const path = usePathname();
  const type = path.split("/")[2];

  if (status === "loading") {
    return <div className="py-8 space-y-4">Loading...</div>;
  }
  return (
    <div className="py-8 space-y-4 animate-appear min-h-[80vh]">
      <h1 className="text-3xl font-bold">
        <ReaderIcon className="w-7 h-7 inline-block mr-2 mb-1" />
        Application
      </h1>
      {type && (
        <>
          <p>
            Register a <b>{type}</b> credential.{" "}
          </p>
          <p className="text-sm text-muted-foreground">
            {type === "company" &&
              "Registering your company here will allow you to issue employee               credentials to your employees that are trusted by all other members of this consortium. For convenience, issuers can optionally use this web application to handle the process of issuing employee credentials."}
          </p>
        </>
      )}
      <Separator className="w-full my-4" />
      {children}
    </div>
  );
};

export default Layout;
