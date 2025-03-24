"use client";

import { DialogHeader } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Credential, CredentialData } from "@/model/credential";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@radix-ui/react-dialog";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { ColumnDef } from "@tanstack/react-table";

export const credentialColumns: ColumnDef<Credential>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "type",
    header: "Type",
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
    accessorKey: "application_id",
    header: "Application ID",
  },
  {
    accessorKey: "metadata",
    header: "Metadata",
    cell: ({ row }) => {
      const metadata = row.getValue("metadata") as CredentialData;
      return (
        <div>
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
                    <DialogTitle>View Credential</DialogTitle>
                    <DialogDescription>
                      Credential ID: {row.getValue("id")}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="max-w-64">
                    <code className="inline-block w-auto">
                      {JSON.stringify(metadata)}
                    </code>
                  </div>
                </DialogContent>
              </Dialog>
              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                Takeout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];
