"use client";

import { Application } from "@/model/application";
import { Credential } from "@/model/credential";
import { ColumnDef } from "@tanstack/react-table";

export const applicationColumns: ColumnDef<Application>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "status",
    header: "Status",
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
    accessorKey: "metadata",
    header: "Metadata",
    cell: ({ row }) => JSON.stringify(row.getValue("metadata")),
  },
];

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
    cell: ({ row }) => JSON.stringify(row.getValue("metadata")),
  },
];
