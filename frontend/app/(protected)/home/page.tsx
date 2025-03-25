"use client";

import ApplyCard from "@/components/cards/apply-card";
import TakeoutCard from "@/components/cards/takeout-card";
import LoginButton from "@/components/LoginButton";
import { Separator } from "@/components/ui/separator";
import { useGetApplicationsByPkh } from "@/hooks/api/application";
import { useGetCredentialsByPkh } from "@/hooks/api/credential";
import { useSession } from "next-auth/react";

const Page = () => {
  const { data: session, status } = useSession();
  const { applications, isLoading: isLoadingApps } = useGetApplicationsByPkh({
    id: session?.user.pkh,
  });
  const { credentials, isLoading: isLoadingCreds } = useGetCredentialsByPkh({
    id: session?.user.pkh as string,
  });

  if (status === "loading" || isLoadingApps || isLoadingCreds) {
    return <div className="py-8 space-y-4">Loading...</div>;
  }

  const openApplications =
    applications?.filter((app) => app.status === "open")?.length ?? 0;

  return (
    <div className="py-8 space-y-4">
      <h1 className="text-3xl">Welcome back 👋</h1>
      <p>Manage credentials and applications here.</p>
      <Separator className="w-full my-4" />
      <div className="flex space-x-4">
        {(["company", "employee"] as const).map((type) => (
          <ApplyCard key={type} type={type} />
        ))}
        <TakeoutCard
          numApps={openApplications}
          numCreds={credentials?.length}
        />
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
