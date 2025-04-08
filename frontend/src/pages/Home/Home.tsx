"use client";

import { useMemo } from "react";

import ApplyCard from "@/components/cards/apply-card";
import IssueCard from "@/components/cards/issue-card";
import TakeoutCard from "@/components/cards/takeout-card";
import { Separator } from "@/components/ui/separator";
import {
  useGetApplicationsByApplicant,
  useGetApplicationsForIssuer,
} from "@/hooks/api/application";
import { useGetCredentialsByPkh } from "@/hooks/api/credential";
import { useSession } from "@/hooks/use-session";
import { useWallet } from "@/hooks/use-wallet";

function Home() {
  const session = useSession();
  const wallet = useWallet();
  const pkh = useMemo(() => {
    if (session.user) return session.user.pkh as string;
    // since auth is enforced at api, we can guess that wallet pkh will be session pkh
    return wallet.account?.address as string;
  }, [session, wallet]);

  const { applications, isLoading: isLoadingApps } =
    useGetApplicationsByApplicant({
      pkh,
    });
  const { applicationsForIssuer, isLoading: isLoadingAppsForIssuer } =
    useGetApplicationsForIssuer({
      pkh,
    });
  const { credentials, isLoading: isLoadingCreds } = useGetCredentialsByPkh({
    pkh,
  });

  const openApplications = useMemo(
    () =>
      !applications || applications.length === 0
        ? 0
        : (applications.filter(app => app.status === "open")?.length ?? 0),
    [applications]
  );

  const companies = useMemo(() => {
    if (!credentials) return [];
    return credentials
      ?.filter(
        cred =>
          ((cred.credential.payload["type"] as string[])[1] as string) ===
          "Company Credential"
      )
      .map(
        cred =>
          (cred.credential?.credentialSubject as { "gx:legalName": string })[
            "gx:legalName"
          ]
      );
  }, [credentials]);

  if (
    isLoadingApps ||
    isLoadingAppsForIssuer ||
    isLoadingCreds ||
    session.status === "loading"
  ) {
    return <div className="space-y-4 py-8">Loading...</div>;
  }

  return (
    <div className="animate-appear min-h-[80vh] space-y-4 py-8">
      <h1 className="text-3xl font-bold">Welcome back 👋</h1>
      <p>Manage credentials and applications here.</p>
      <Separator className="my-4 w-full" />
      <div className="flex flex-wrap gap-4">
        {session.user?.isRegistrar && (
          <IssueCard
            companyName="The Registrar"
            applications={applicationsForIssuer ?? []}
          />
        )}

        {/* should only ever be one company active */}
        {companies && companies.length > 0 && (
          <IssueCard
            companyName={companies[0]}
            applications={applicationsForIssuer ?? []}
          />
        )}

        {!session.user?.isRegistrar &&
          (["company", "employee"] as const).map(type => (
            <ApplyCard key={type} type={type} />
          ))}

        {!session.user?.isRegistrar && (
          <TakeoutCard
            numApps={openApplications}
            numCreds={credentials?.length}
          />
        )}
      </div>
    </div>
  );
}

export default Home;
