"use client";

import { StatusPill } from "@/components/status-pill";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Application,
  ApplicationMetadata,
  ApplicationStatus,
} from "@/model/application";

import { EntityType, EntityTypePill } from "@/components/type-pill";
import { Button } from "@/components/ui/button";
import { useUpdateApplication } from "@/hooks/api/application";
import { useCreateCredential } from "@/hooks/api/credential";
import { useIssueCredential } from "@/hooks/use-issue-credential";
import { toast } from "@/hooks/use-toast";
import { useWallet } from "@/hooks/use-wallet";
import { CreateCredential, CredentialFormat } from "@/model/credential";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { ColumnDef, Row } from "@tanstack/react-table";
import React from "react";
import ApplicationFormDisplay from "../view-application";

export const applicationColumns: ColumnDef<Application>[] = [
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => (
      <div className="max-w-[10rem] truncate">{row.getValue("id")}</div>
    ),
  },
  {
    accessorKey: "metadata",
    header: "Name",
    cell: ({ row }) =>
      (row.getValue("metadata") as ApplicationMetadata).legalName,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status");
      return <StatusPill status={status as ApplicationStatus} />;
    },
  },
  {
    id: "type",
    header: "Type",
    cell: ({ row }) => {
      const entityType = Object.prototype.hasOwnProperty.call(
        row.getValue("metadata"),
        "role",
      )
        ? "employee"
        : "company";
      return <EntityTypePill type={entityType as EntityType} />;
    },
  },
  {
    accessorKey: "created_at",
    header: "Created At",
    cell: ({ row }) =>
      new Date(row.getValue("created_at")).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const { metadata } = row.original as ApplicationMetadata;
      return DisplayApplicationMenu(row, metadata);
    },
  },
];

function DisplayApplicationMenu(
  row: Row<Application>,
  metadata: string | number | boolean | object,
): React.ReactNode {
  const { mutateAsync: updateApplication, isPending } = useUpdateApplication();
  const { mutateAsync: createCredential } = useCreateCredential();
  const { issueCredential } = useIssueCredential();
  const { dAppClient } = useWallet();

  const entityType = Object.prototype.hasOwnProperty.call(
    row.getValue("metadata"),
    "role",
  )
    ? "employee"
    : "company";

  if (isPending) {
    return <div>Updating...</div>;
  }

  if (row.getValue("status") !== ApplicationStatus.Open) {
    return null;
  }

  const handleIssuance = async (status: ApplicationStatus): Promise<void> => {
    try {
      if (!dAppClient) {
        throw new Error("Failed to connect to wallet.");
      }

      const applicationId = row.getValue("id") as string;

      // Only attempt credential issuance for accepted applications
      if (status === ApplicationStatus.Accepted) {
        const credentialType =
          entityType === "company" ? "company" : "employee";
        const credential = (await issueCredential(
          row.original as Application,
          credentialType,
          dAppClient,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        )) as any; // Credential

        if (!credential) {
          throw new Error("Failed to issue credential.");
        }

        console.log("Credential issued:", credential);
        const credentialPayload = {
          holder_pkh: credential.credentialSubject?.id,
          subject: credential.id,
          issuer: credential.issuer,
          format: CredentialFormat.LD, // TODO: handle JWT too
          credential: credential,
          application_id: applicationId,
          type: credentialType,
        } as CreateCredential;
        console.log("Storing credential DB...", credentialPayload);

        const createCredentialResponse = await createCredential(
          credentialPayload,
        ).then((res) => res.message);

        console.log("Credential stored:", createCredentialResponse);

        const updateResponse = await updateApplication({
          id: applicationId,
          type: entityType,
          status,
          metadata: JSON.stringify(metadata),
        }).then((res) => res.message);

        if (!updateResponse) {
          throw new Error("Failed to update application.");
        }

        console.log("Application updated:", updateResponse);
      }
    } catch (error) {
      console.error("Failed to process application:", error);
      toast({
        title: "Error",
        description: "Failed to process application. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <DotsHorizontalIcon />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <Dialog>
          <DialogTrigger asChild>
            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
              View
            </DropdownMenuItem>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>View Application</DialogTitle>
              <DialogDescription>
                Application ID: {row.getValue("id")}
              </DialogDescription>
            </DialogHeader>
            <ApplicationFormDisplay data={metadata} />
          </DialogContent>
        </Dialog>
        <Dialog>
          <DialogTrigger asChild>
            <DropdownMenuItem
              className="text-green-500"
              onSelect={(e) => e.preventDefault()}
            >
              Approve
            </DropdownMenuItem>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Approve Application</DialogTitle>
              <DialogDescription>
                You are about to approve an application with the ID:{" "}
                {row.getValue("id")}.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="sm:justify-start">
              <DialogClose asChild>
                <Button type="button" variant="secondary">
                  Cancel
                </Button>
              </DialogClose>
              <Button
                type="button"
                onClick={async () => {
                  await handleIssuance(ApplicationStatus.Accepted).then(() => {
                    toast({
                      title: "Accepted",
                      description: "Application has been accepted.",
                    });
                  });
                }}
              >
                Yes, I want to approve this application.
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <DropdownMenuItem
          className="text-red-500"
          onClick={async () => {
            console.log("reject");
            await handleIssuance(ApplicationStatus.Rejected).then(() => {
              toast({
                title: "Rejected",
                description: "Application has been rejected.",
              });
            });
          }}
        >
          Reject
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
