"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { capitalize } from "@/lib/utils";
import Link from "next/link";
import { Button } from "../ui/button";
import { ArrowRightIcon } from "lucide-react";

type Props = {
  type: "company" | "employee";
};

const ApplyCard = ({ type }: Props) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{`Apply as ${capitalize(type)}`}</CardTitle>
        <CardDescription>
          Apply for a <b>{type}</b> credential.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button asChild className="w-full">
          <Link href={`/apply/${type}`}>
            Apply
            <ArrowRightIcon className="w-4 h-4 ml-1" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
};

export default ApplyCard;
