"use client";

import { useMemo } from "react";

import { applicationColumns } from "@/components/table/columns/application";
import { credentialColumns } from "@/components/table/columns/credential";
import { DataTable } from "@/components/table/data-table";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGetApplicationsByApplicant } from "@/hooks/api/application";
import { useGetCredentialsByPkh } from "@/hooks/api/credential";
import { useSession } from "@/hooks/use-session";
import { useTheme } from "@/components/providers/theme-provider";

const Page = () => {
  const session = useSession();
  const pkh = useMemo(() => {
    if (session.user) return session.user.pkh as string;
    // since auth is enforced at api, we can safely guess that wallet pkh will be session pkh
    return "OxO" as string;
  }, [session]);
  const { applications } = useGetApplicationsByApplicant({
    pkh,
  });
  const { credentials } = useGetCredentialsByPkh({
    pkh,
  });

  const theme = useTheme();
  const primaryColor = useMemo(() => {
    return theme.theme === "dark" ? "#FFFFFF" : "#000000";
  }, [theme]);

  if (session.status === "loading") {
    return <div className="space-y-4 py-8">Loading...</div>;
  }

  return (
    <div className="animate-appear min-h-[80vh] space-y-4 py-8">
      <h1 className="text-3xl font-bold">Credentials</h1>
      <p>View pending applications and manage your credentials here.</p>
      <Separator className="my-4 w-full" />
      <Tabs defaultValue="applications" className="w-full">
        <div className="flex justify-center py-2">
          <TabsList className="flex w-full items-center lg:max-w-xl">
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
            <DataTable
              columns={applicationColumns(false)}
              data={applications}
            />
          )}
          {applications && applications.length === 0 && (
            <div className="flex justify-center space-y-4">
              <p className="text-lg font-medium">No applications found.</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="credentials">
          {credentials && credentials.length > 0 && (
            <DataTable
              columns={credentialColumns(primaryColor)}
              data={credentials}
            />
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
