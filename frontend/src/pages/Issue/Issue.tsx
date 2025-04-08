"use client";

import { useMemo } from "react";

import { applicationColumns } from "@/components/table/columns/application";
import { DataTable } from "@/components/table/data-table";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetApplicationsForIssuer } from "@/hooks/api/application";
import { useSession } from "@/hooks/use-session";
import { Application } from "@/model/application";

const Page = () => {
  const session = useSession();

  const { applicationsForIssuer, isLoading } = useGetApplicationsForIssuer({
    pkh: session.user?.pkh || "",
  });

  const isCompanyAdmin = useMemo(
    () => !!session.user?.companyCredential,
    [session]
  );

  const companyName = useMemo(() => {
    if (!session.user) {
      return "UNKNOWN";
    }
    if (session.user.isRegistrar) {
      return "The Registrar";
    }
    if (session.user.companyCredential) {
      return session.user.companyCredential.name;
    }
  }, [session]);

  if (session.status === "loading") {
    return <div className="space-y-4 py-8">Loading...</div>;
  }

  const sortedApplications =
    (applicationsForIssuer &&
      applicationsForIssuer?.length > 0 &&
      applicationsForIssuer?.sort((a, b) => {
        return (
          new Date(b.created_at ?? "").getTime() -
          new Date(a.created_at ?? "").getTime()
        );
      })) ??
    [];

  return (
    <div className="animate-appear min-h-[80vh] space-y-4 py-8">
      <h1 className="text-3xl font-bold">Applications: {companyName}</h1>
      {isCompanyAdmin && (
        <p>
          Manage employee applications for <b>{companyName}</b> here.
        </p>
      )}
      <Separator className="my-4 w-full" />
      {isLoading && (
        <>
          <Skeleton className="h-8" />
          <Skeleton className="h-8" />
          <Skeleton className="h-8" />
        </>
      )}

      {!applicationsForIssuer && !isLoading && (
        <p>No applications {companyName ? `for ${companyName}` : ""} found.</p>
      )}

      {applicationsForIssuer && applicationsForIssuer.length > 0 && (
        <DataTable
          columns={applicationColumns}
          data={sortedApplications as Application[]}
        />
      )}
    </div>
  );
};

export default Page;
