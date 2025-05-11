"use client";

import { cn } from "@/lib/utils";
import { ApplicationStatus } from "@/model/application";

interface StatusPillProps {
  status: ApplicationStatus;
  className?: string;
}

export function StatusPill({ status, className }: StatusPillProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        status === ApplicationStatus.Open &&
          "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-500",
        status === ApplicationStatus.Rejected &&
          "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-500",
        status === ApplicationStatus.Accepted &&
          "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-500",
        className
      )}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}
