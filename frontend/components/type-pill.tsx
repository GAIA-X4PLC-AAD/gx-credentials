"use client";

import { cn } from "@/lib/utils";

export enum EntityType {
  Employee = "employee",
  Company = "company",
}

interface EntityTypePillProps {
  type: EntityType;
  className?: string;
}

export function EntityTypePill({ type, className }: EntityTypePillProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        type === EntityType.Employee &&
          "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-500",
        type === EntityType.Company &&
          "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-500",
        className,
      )}
    >
      {type.charAt(0).toUpperCase() + type.slice(1)}
    </span>
  );
}
