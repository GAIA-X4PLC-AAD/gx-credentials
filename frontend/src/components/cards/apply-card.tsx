"use client";

import { Separator } from "@radix-ui/react-dropdown-menu";
import { BackpackIcon, PersonIcon } from "@radix-ui/react-icons";
import { ArrowRightIcon } from "lucide-react";
import { Link } from "react-router";

import { Button } from "../ui/button";

import { capitalize, cn } from "@/lib/utils";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type Props = {
  type: "company" | "employee";
};

const ApplyCard = ({ type }: Props) => {
  return (
    <Link to={`/apply/${type}`}>
      <Card
        className={cn(
          "h-full cursor-pointer transition-all duration-300",
          "hover:scale-105 hover:shadow-lg",
          type === "company"
            ? "bg-purple-100 hover:bg-purple-200 dark:bg-purple-900/30 dark:hover:bg-purple-900/40"
            : "bg-blue-100 hover:bg-blue-200 dark:bg-blue-900/30 dark:hover:bg-blue-900/40"
        )}
      >
        <CardHeader className="min-h-[9.25rem]">
          <CardTitle className="flex items-center">
            {type === "company" ? (
              <BackpackIcon className="mr-2 size-6" />
            ) : (
              <PersonIcon className="mr-2 size-6" />
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
            Apply <ArrowRightIcon className="ml-1 h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default ApplyCard;
