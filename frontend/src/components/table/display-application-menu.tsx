"use client";

import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { Row } from "@tanstack/react-table";
import React from "react";

import ApplicationFormDisplay from "./view-application";

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
import { Button } from "@/components/ui/button";
import { useUpdateApplication } from "@/hooks/api/application";
import { useCreateCredential } from "@/hooks/api/credential";
import { useIssueCredential } from "@/hooks/use-issue-credential";
import { toast } from "@/hooks/use-toast";
import { useWallet } from "@/hooks/use-wallet";
import { CreateCredential, CredentialFormat } from "@/model/credential";

type DisplayApplicationMenu = {
  row: Row<Application>;
  metadata: ApplicationMetadata;
  editable: boolean;
};

export const DisplayApplicationMenu = ({
  row,
  metadata,
  editable = false,
}: DisplayApplicationMenu) => {
  const { mutateAsync: updateApplication, isPending } = useUpdateApplication();
  const { mutateAsync: createCredential } = useCreateCredential();
  const { issueCredential } = useIssueCredential();
  const { dAppClient } = useWallet();

  const entityType = Object.prototype.hasOwnProperty.call(
    row.getValue("metadata"),
    "role"
  )
    ? "employee"
    : "company";

  if (isPending) {
    return <div>Updating...</div>;
  }

  const showEditButtons =
    editable && row.getValue("status") === ApplicationStatus.Open;

  const handleIssuance = async (
    status: ApplicationStatus,
    format?: CredentialFormat
  ): Promise<void> => {
    try {
      if (!dAppClient) {
        throw new Error("Failed to connect to wallet.");
      }

      const applicationId = row.getValue("id") as string;
      const credentialType = entityType === "company" ? "company" : "employee";
      console.log("Issuing", format, "credential");

      // Only attempt credential issuance for accepted applications
      if (status === ApplicationStatus.Accepted && format) {
        const credential = (await issueCredential(
          row.original as Application,
          credentialType,
          dAppClient
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        )) as any; // Credential

        if (!credential) {
          throw new Error("Failed to issue credential.");
        }

        console.log("Credential issued:", credential);
        // we know that our use DIDs are pkh:tezos, so we can just split
        const credentialPayload = {
          holder_pkh: credential.payload.sub.split(":")[4],
          subject: credential.payload.sub,
          issuer: credential.payload.iss,
          issuer_pkh: credential.payload.iss.split(":")[4],
          name: credential.payload.vc.credentialSubject["gx:legalName"],
          format,
          credential: credential,
          application_id: applicationId,
          type: credentialType,
        } as CreateCredential;
        console.log("Storing credential DB...", credentialPayload);

        const createCredentialResponse = await createCredential(
          credentialPayload
        ).then(res => res.message);

        console.log("Credential stored:", createCredentialResponse);

        const updateResponse = await updateApplication({
          id: applicationId,
          type: entityType,
          status,
          metadata: JSON.stringify(metadata),
        }).then(res => res.message);

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

  const handleReject = async () => {
    try {
      const applicationId = row.getValue("id") as string;
      const updateResponse = await updateApplication({
        id: applicationId,
        type: entityType,
        status: ApplicationStatus.Rejected,
        metadata: JSON.stringify(metadata),
      }).then(res => res.message);

      if (!updateResponse) {
        throw new Error("Failed to update application.");
      }

      console.log("Application updated:", updateResponse);
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
        <ViewDialog row={row} metadata={metadata} />
        {showEditButtons && (
          <IssueDialog row={row} handleIssuance={handleIssuance} />
        )}
        {showEditButtons && (
          <DropdownMenuItem
            className="text-red-500"
            onClick={async () => {
              await handleReject().then(() => {
                toast({
                  title: "Rejected",
                  description: "Application has been rejected.",
                });
              });
            }}
          >
            Reject
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

function ViewDialog({
  row,
  metadata,
}: {
  row: Row<Application>;
  metadata: ApplicationMetadata;
}): React.JSX.Element {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <DropdownMenuItem onSelect={e => e.preventDefault()}>
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
  );
}

function IssueDialog({
  row,
  handleIssuance,
}: {
  row: Row<Application>;
  handleIssuance: (
    status: ApplicationStatus,
    format?: CredentialFormat
  ) => Promise<void>;
}): React.JSX.Element {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <DropdownMenuItem
          className="text-green-500"
          onSelect={e => e.preventDefault()}
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
              await handleIssuance(
                ApplicationStatus.Accepted,
                CredentialFormat.JWT
              ).then(() => {
                toast({
                  title: "Accepted",
                  description:
                    "Application has been accepted and the credential has been issued in JWT format.",
                });
              });
            }}
          >
            Issue Credential
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
