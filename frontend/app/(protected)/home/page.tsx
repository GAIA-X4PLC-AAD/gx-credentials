"use client";

import ApplyCard from "@/components/cards/apply-card";
import IssueCard from "@/components/cards/issue-card";
import TakeoutCard from "@/components/cards/takeout-card";
import LoginButton from "@/components/LoginButton";
import { Separator } from "@/components/ui/separator";
import { useGetApplicationsByPkh } from "@/hooks/api/application";
import { useGetCredentialsByPkh } from "@/hooks/api/credential";
import { useSession } from "next-auth/react";
import { useMemo } from "react";

const Page = () => {
  const { data: session, status } = useSession();
  const { applications, isLoading: isLoadingApps } = useGetApplicationsByPkh({
    id: session?.user.pkh,
  });
  const { credentials, isLoading: isLoadingCreds } = useGetCredentialsByPkh({
    id: session?.user.pkh as string,
  });

  const openApplications = useMemo(
    () => applications?.filter((app) => app.status === "open")?.length ?? 0,
    [applications],
  );

  const companies = useMemo(() => {
    return [
      ...new Set(
        credentials
          ?.filter(
            (cred) =>
              ((cred.credential?.type as string[])[1] as string) ===
              "Company Credential",
          )
          .map(
            (cred) =>
              (
                cred.credential?.credentialSubject as { "gx:legalName": string }
              )["gx:legalName"],
          ),
      ),
    ];
  }, [credentials]);

  if (status === "loading" || isLoadingApps || isLoadingCreds) {
    return <div className="py-8 space-y-4">Loading...</div>;
  }

  return (
    <div className="py-8 space-y-4">
      <h1 className="text-3xl">Welcome back 👋</h1>
      <p>Manage credentials and applications here.</p>
      <Separator className="w-full my-4" />
      <div className="flex flex-wrap gap-4">
        {companies &&
          companies.length > 0 &&
          companies.map((company) => (
            <IssueCard
              key={company}
              companyName={company}
              allApplications={applications ?? []}
            />
          ))}

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
