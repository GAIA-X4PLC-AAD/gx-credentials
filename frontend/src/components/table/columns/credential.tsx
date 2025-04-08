"use client";

import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { ColumnDef } from "@tanstack/react-table";
import { QRCodeSVG } from "qrcode.react";

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

export const credentialColumns: ColumnDef<Credential>[] = [
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => {
      const id = row.original?.credential?.payload.id as string;
      return (
        <div className="truncate sm:max-w-[12rem] lg:max-w-full">
          <code>{id}</code>
        </div>
      );
    },
  },
  {
    accessorKey: "created_at",
    header: "Created",
    cell: ({ row }) =>
      new Date(row.getValue("created_at")).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }),
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => {
      const name = row.original?.name as string;
      return <code className="font-semibold">{name}</code>;
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
        <div className="truncate sm:max-w-[12rem] lg:max-w-full">
          <code>{appId}</code>
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const credential = row.original.credential as CredentialData;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger>
            <DotsHorizontalIcon />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <Dialog>
              <DialogTrigger asChild>
                <DropdownMenuItem onSelect={e => e.preventDefault()}>
                  View
                </DropdownMenuItem>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>View Credential</DialogTitle>
                  <DialogDescription>
                    Credential ID: {credential?.payload.id as string}
                  </DialogDescription>
                </DialogHeader>
                <Textarea
                  className="min-h-[65vh] w-full"
                  value={JSON.stringify(credential, null, 2)}
                  disabled
                />
              </DialogContent>
            </Dialog>
            <Dialog>
              <DialogTrigger asChild>
                <DropdownMenuItem onSelect={e => e.preventDefault()}>
                  Takeout
                </DropdownMenuItem>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Download Credential</DialogTitle>
                  <DialogDescription>
                    Credential ID: {credential?.payload.id as string}
                  </DialogDescription>
                </DialogHeader>
                <p>
                  Scan the QR Code below with the SSI wallet of your choice:
                </p>
                <div className="my-4 flex justify-center">
                  <QRCodeSVG
                    value={row.original?.offer || ""}
                    bgColor="#00000000"
                    fgColor="#6D28D9"
                    size={256}
                  />
                </div>
              </DialogContent>
            </Dialog>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
