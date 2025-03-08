"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { capitalize, cn } from "@/lib/utils";
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
          "cursor-pointer transition-all duration-500",
          "hover:shadow-lg hover:scale-105 hover:bg-secondary"
        )}
      >
        <CardHeader>
          <CardTitle className="flex items-center">
            {type === "company" ? (
              <BackpackIcon className="size-4 mr-1" />
            ) : (
              <PersonIcon className="size-4 mr-1" />
            )}{" "}
            {`Apply as ${capitalize(type)}`}
          </CardTitle>
          <CardDescription>
            Apply for a <b>{type}</b> credential.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="default" className="w-full">
            Apply <ArrowRightIcon className="w-4 h-4 ml-1" />
          </Button>
        </CardContent>
      </Card>
    </Link>
  );
};

export default ApplyCard;
