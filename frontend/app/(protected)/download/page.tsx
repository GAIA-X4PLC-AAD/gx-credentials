"use client";

import { Separator } from "@/components/ui/separator";
import { useSession } from "next-auth/react";

const Page = () => {
  const { status } = useSession();
  if (status === "loading") {
    return <div className="py-8 space-y-4">Loading...</div>;
  }

  return (
    <div className="py-8 space-y-4">
      <h1 className="text-3xl">Credentials</h1>
      <p>Download your credentials here.</p>
      <Separator className="w-full my-4" />
    </div>
  );
};

export default Page;
