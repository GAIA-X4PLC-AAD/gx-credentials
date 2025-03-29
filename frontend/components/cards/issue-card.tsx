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

  // TODO: insert company name as query parameter
  return (
    <Link href={`/issue`}>
      <Card
        className={cn(
          "cursor-pointer transition-all duration-500 h-full w-[14rem]",
          "hover:shadow-lg hover:scale-105",
        )}
      >
        <CardHeader className="min-h-[9.25rem]">
          <CardTitle className="flex items-center">
            <PersonIcon className="size-6 mr-2" />
            {`${companyName}`}
          </CardTitle>
          <Separator className="w-full" />
          <CardDescription className="text-pretty">
            Manage employee credentials for {companyName}.
            {openApplications ? (
              <p className="text-xs text-amber-500">
                {openApplications} open applications
              </p>
            ) : (
              <p className="text-xs text-blue-500">No open applications</p>
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

export default IssueCard;
