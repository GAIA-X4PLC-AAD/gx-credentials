"use client";

import { applicationColumns } from "@/components/table/columns/application";
import { DataTable } from "@/components/table/data-table";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetApplicationsForIssuer } from "@/hooks/api/application";
import { Application, ApplicationType } from "@/model/application";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";

const Page = () => {
  const { data: session, status } = useSession();

  const searchParams = useSearchParams();
  const companyName = searchParams.get("company");
  const type = searchParams.get("type") as ApplicationType;

  const { applications, isLoading } = useGetApplicationsForIssuer({
    companyName: companyName ?? "",
    type: type ?? "employee",
  });

  if (status === "loading") {
    return <div className="py-8 space-y-4">Loading...</div>;
  }

  const sortedApplications =
    (applications &&
      applications?.length > 0 &&
      applications?.sort((a, b) => {
        return (
          new Date(b.created_at ?? "").getTime() -
          new Date(a.created_at ?? "").getTime()
        );
      })) ??
    [];

  return (
    <div className="py-8 space-y-4 animate-appear min-h-[80vh]">
      <h1 className="text-3xl font-bold">Applications: {companyName}</h1>
      {Number(session?.user?.role) > 2 && (
        <p>
          Manage employee applications for <b>{companyName}</b> here.
        </p>
      )}
      <Separator className="w-full my-4" />
      {isLoading && (
        <>
          <Skeleton className="h-8" />
          <Skeleton className="h-8" />
          <Skeleton className="h-8" />
        </>
      )}

      {!applications && !isLoading && (
        <p>No applications {companyName ? `for ${companyName}` : ""} found.</p>
      )}

      {applications && applications.length > 0 && (
        <DataTable
          columns={applicationColumns}
          data={sortedApplications as Application[]}
        />
      )}
    </div>
  );
};

export default Page;
