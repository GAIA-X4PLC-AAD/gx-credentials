"use client";

import { ColumnDef } from "@tanstack/react-table";

import { DisplayApplicationMenu } from "../display-application-menu";

import { StatusPill } from "@/components/status-pill";
import {
  Application,
  ApplicationMetadata,
  ApplicationStatus,
} from "@/model/application";
import { EntityType, EntityTypePill } from "@/components/type-pill";

export const applicationColumns: ColumnDef<Application>[] = (
  editable: boolean
) => [
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => (
      <div className="truncate sm:max-w-[12rem] lg:max-w-full">
        <code>{row.getValue("id")}</code>
      </div>
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
        "role"
      )
        ? "employee"
        : "company";
      return <EntityTypePill type={entityType as EntityType} />;
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
    id: "actions",
    cell: ({ row }) => {
      const { metadata } = row.original;
      return (
        <DisplayApplicationMenu
          row={row}
          metadata={metadata as ApplicationMetadata}
          editable={editable}
        />
      );
    },
  },
];
