"use client";

import { EntityType, EntityTypePill } from "@/components/type-pill";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import { Textarea } from "@/components/ui/textarea";
import { Credential, CredentialData } from "@/model/credential";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { ColumnDef } from "@tanstack/react-table";

export const credentialColumns: ColumnDef<Credential>[] = [
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => {
      const id = row.original?.credential?.id as string;
      return (
        <div className="sm:max-w-[12rem] lg:max-w-full truncate">
          <code>{id}</code>
        </div>
      );
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
    accessorKey: "format",
    header: "Format",
    cell: ({ row }) => {
      const format = row.original?.format as string;
      return <code className="font-semibold">{format}</code>;
    },
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => {
      const type =
        row.original?.credential?.type ===
        "VerifiableCredentialEmployee Credential"
          ? "employee"
          : "company";
      return <EntityTypePill type={type as EntityType} />;
    },
  },
  {
    accessorKey: "application_id",
    header: "Application ID",
    cell: ({ row }) => {
      const appId = row.getValue("application_id") as string;
      return (
        <div className="sm:max-w-[12rem] lg:max-w-full truncate">
          <code>{appId}</code>
        </div>
      );
    },
  },
  {
    id: "actions",
    accessorKey: "metadata",
    cell: ({ row }) => {
      const credential = row.original.credential as CredentialData;
      return (
        <Dialog>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <DotsHorizontalIcon />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DialogTrigger asChild>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                  View
                </DropdownMenuItem>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>View Credential</DialogTitle>
                  <DialogDescription>
                    Credential ID: {credential?.id as string}
                  </DialogDescription>
                </DialogHeader>
                <Textarea
                  className="w-full min-h-[65vh]"
                  value={JSON.stringify(credential, null, 2)}
                  disabled
                />
              </DialogContent>
              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                Takeout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </Dialog>
      );
    },
  },
];
