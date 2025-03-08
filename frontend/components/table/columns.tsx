"use client";

import { Application } from "@/model/application";
import { ColumnDef } from "@tanstack/react-table";

export const columns: ColumnDef<Application>[] = [
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
      new Date(row.getValue("created_at")).toLocaleDateString(),
  },
  {
    accessorKey: "metadata",
    header: "Metadata",
  },
];
