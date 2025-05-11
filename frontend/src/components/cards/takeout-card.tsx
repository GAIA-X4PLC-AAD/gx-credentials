"use client";

import { Separator } from "@radix-ui/react-dropdown-menu";
import { BackpackIcon, OpenInNewWindowIcon } from "@radix-ui/react-icons";
import { ArrowRightIcon, IdCardIcon } from "lucide-react";
import { Link } from "react-router";

import { Button } from "../ui/button";

import { cn } from "@/lib/utils";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type TakeoutCardProps = {
  numApps?: number;
  numCreds?: number;
};

const TakeoutCard = ({
  numApps,
  numCreds,
}: TakeoutCardProps): React.JSX.Element => {
  return (
    <Link to={`/takeout`}>
      <Card
        className={cn(
          "cursor-pointer transition-all duration-300",
          "hover:scale-105 hover:bg-secondary hover:shadow-lg"
        )}
      >
        <CardHeader>
          <CardTitle className="flex items-center">
            <OpenInNewWindowIcon className="mr-2 size-6" />
            <span>Takeout</span>
          </CardTitle>
          <Separator className="w-full" />
          <CardDescription className="space-y-1">
            Manage your applications and credentials here.
            <div className="flex items-center">
              <BackpackIcon className="mr-2 h-4 w-4" />

              <p className="font-semibold">{numApps} open applications</p>
            </div>
            <div className="flex items-center">
              <IdCardIcon className="mr-2 h-4 w-4" />
              <p className="font-semibold">{numCreds} credentials</p>
            </div>
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <Button variant="outline" className="w-full">
            Manage <ArrowRightIcon className="ml-1 h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default TakeoutCard;
