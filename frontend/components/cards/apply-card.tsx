"use client";

import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { capitalize, cn } from "@/lib/utils";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { BackpackIcon, PersonIcon } from "@radix-ui/react-icons";
import { ArrowRightIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";

type Props = {
  type: "company" | "employee";
};

const ApplyCard = ({ type }: Props) => {
  return (
    <Link href={`/apply/${type}`}>
      <Card
        className={cn(
          "cursor-pointer transition-all duration-500 h-full",
          "hover:shadow-lg hover:scale-105",
          type === "company"
            ? "bg-blue-100 dark:bg-blue-900/30 hover:bg-blue-200 dark:hover:bg-blue-900/40"
            : "bg-purple-100 dark:bg-purple-900/30 hover:bg-purple-200 dark:hover:bg-purple-900/40",
        )}
      >
        <CardHeader className="min-h-[9.25rem]">
          <CardTitle className="flex items-center">
            {type === "company" ? (
              <BackpackIcon className="size-6 mr-2" />
            ) : (
              <PersonIcon className="size-6 mr-2" />
            )}{" "}
            {`Apply as ${capitalize(type)}`}
          </CardTitle>
          <Separator className="w-full" />
          <CardDescription>
            Apply for a <b>{type}</b> credential.
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <Button variant="outline" className="w-full">
            Apply <ArrowRightIcon className="w-4 h-4 ml-1" />
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default ApplyCard;
