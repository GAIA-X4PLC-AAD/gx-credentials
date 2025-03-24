"use client";

import { applicationColumns } from "@/components/table/columns/application";
import { DataTable } from "@/components/table/data-table";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetApplicationsByPkh } from "@/hooks/api/application";
import { Application } from "@/model/application";
import { useSession } from "next-auth/react";

const Page = () => {
  const { data: token, status } = useSession();
  // TODO: applications for a specific company from query parameter
  const { applications, isLoading } = useGetApplicationsByPkh({
    id: token?.user?.pkh ?? "",
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
    <div className="py-8 space-y-4">
      <h1 className="text-3xl">Applications</h1>
      {Number(token?.user?.role) > 2 && (
        <p>Manage applications for company credentials here.</p>
      )}
      <Separator className="w-full my-4" />
      {isLoading && (
        <>
          <Skeleton className="h-8" />
          <Skeleton className="h-8" />
          <Skeleton className="h-8" />
        </>
      )}

      {!applications && !isLoading && <p>No applications found.</p>}

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
