"use client";

import { applicationColumns } from "@/components/table/columns/application";
import { credentialColumns } from "@/components/table/columns/credential";
import { DataTable } from "@/components/table/data-table";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGetApplicationsByPkh } from "@/hooks/api/application";
import { useGetCredentialsByPkh } from "@/hooks/api/credential";

import { useSession } from "next-auth/react";

const Page = () => {
  const { data: token, status } = useSession();
  const { applications } = useGetApplicationsByPkh({
    id: token?.user?.pkh ?? "",
  });
  const { credentials } = useGetCredentialsByPkh({
    id: token?.user?.pkh ?? "",
  });

  if (status === "loading") {
    return <div className="py-8 space-y-4">Loading...</div>;
  }

  return (
    <div className="py-8 space-y-4">
      <h1 className="text-3xl">Credentials</h1>
      <p>View pending applications and manage your credentials here.</p>
      <Separator className="w-full my-4" />
      <Tabs defaultValue="applications" className="w-full">
        <div className="flex justify-center py-2">
          <TabsList className="w-full lg:max-w-xl flex items-center">
            <TabsTrigger value="applications" className="flex-1">
              Applications
            </TabsTrigger>
            <TabsTrigger value="credentials" className="flex-1">
              Credentials
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="applications">
          {applications && applications.length > 0 && (
            <DataTable columns={applicationColumns} data={applications} />
          )}
          {applications && applications.length === 0 && (
            <div className="flex justify-center space-y-4">
              <p className="text-lg font-medium">No applications found.</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="credentials">
          {credentials && credentials.length > 0 && (
            <DataTable columns={credentialColumns} data={credentials} />
          )}
          {credentials && credentials.length === 0 && (
            <div className="flex justify-center space-y-4">
              <p className="text-lg font-medium">No credentials found.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Page;
