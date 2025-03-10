"use client";

import { applicationColumns } from "@/components/table/columns";
import { DataTable } from "@/components/table/data-table";
import { Separator } from "@/components/ui/separator";
import { useGetApplicationsByPkh } from "@/hooks/api/application";
import { useSession } from "next-auth/react";

const Page = () => {
  const { data: token, status } = useSession();
  const { applications } = useGetApplicationsByPkh({
    id: token?.user?.pkh ?? "",
  });

  if (status === "loading") {
    return <div className="py-8 space-y-4">Loading...</div>;
  }

  return (
    <div className="py-8 space-y-4">
      <h1 className="text-3xl">Applications</h1>
      {Number(token?.user?.role) > 2 && (
        <p>Manage applications for company credentials here.</p>
      )}
      <Separator className="w-full my-4" />
      {applications && applications.length > 0 && (
        <DataTable columns={applicationColumns} data={applications} />
      )}
    </div>
  );
};

export default Page;
