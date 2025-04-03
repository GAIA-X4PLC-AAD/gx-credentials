"use client";

import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Application } from "@/model/application";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { PersonIcon } from "@radix-ui/react-icons";
import { ArrowRightIcon } from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";
import { Button } from "../ui/button";

type Props = {
  companyName: string;
  allApplications: Application[];
};

const IssueCard = ({ companyName, allApplications }: Props) => {
  const openApplications = useMemo(
    () =>
      allApplications?.filter(
        (app) =>
          app.status === "open" && app.metadata?.companyName === companyName,
      ).length,
    [allApplications, companyName],
  );

  const colorIndex = getColorIndexFromString(companyName);
  const borderColorClass = tailwindColors[colorIndex];

  return (
    <Link href={`/issue?company=${companyName}&type=employee`}>
      <Card
        className={cn(
          "cursor-pointer transition-all duration-300 h-full w-[18rem] border-2",
          "hover:shadow-lg hover:scale-105 hover:bg-secondary",
          borderColorClass,
        )}
      >
        <CardHeader>
          <CardTitle className="flex items-center">
            <PersonIcon className="size-6 mr-2" />
            {`${companyName}`}
          </CardTitle>
          <Separator className="w-full" />
          <CardDescription className="text-pretty truncate">
            Manage employee credentials for {companyName}.
            {openApplications ? (
              <p className="text-xs text-amber-500">
                {openApplications} open applications
              </p>
            ) : (
              <p className="text-xs text-secondary">No open applications</p>
            )}
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <Button variant="outline" className="w-full">
            Manage <ArrowRightIcon className="w-4 h-4 ml-1" />
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
};

// border colors, must be static: https://tailwindcss.com/docs/detecting-classes-in-source-files#dynamic-class-names
const tailwindColors = [
  "border-red-500/30",
  "border-orange-500/30",
  "border-amber-500/30",
  "border-yellow-500/30",
  "border-lime-500/30",
  "border-green-500/30",
  "border-emerald-500/30",
  "border-teal-500/30",
  "border-cyan-500/30",
  "border-sky-500/30",
  "border-blue-500/30",
  "border-indigo-500/30",
  "border-violet-500/30",
  "border-purple-500/30",
  "border-fuchsia-500/30",
  "border-pink-500/30",
  "border-rose-500/30",
];

// Generate a consistent index based on the string
const getColorIndexFromString = (input: string) => {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = input.charCodeAt(i) + ((hash << 5) - hash);
  }

  // Make sure the hash is positive and map it to the array length
  return Math.abs(hash) % tailwindColors.length;
};

export default IssueCard;
