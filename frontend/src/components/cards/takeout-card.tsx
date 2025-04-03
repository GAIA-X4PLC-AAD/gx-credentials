"use client";

import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { BackpackIcon, OpenInNewWindowIcon } from "@radix-ui/react-icons";
import { ArrowRightIcon, IdCardIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";

type TakeoutCardProps = {
  numApps?: number;
  numCreds?: number;
};

const TakeoutCard = ({
  numApps,
  numCreds,
}: TakeoutCardProps): React.JSX.Element => {
  return (
    <Link href={`/takeout`}>
      <Card
        className={cn(
          "cursor-pointer transition-all duration-300",
          "hover:shadow-lg hover:scale-105 hover:bg-secondary",
        )}
      >
        <CardHeader>
          <CardTitle className="flex items-center">
            <OpenInNewWindowIcon className="size-6 mr-2" />
            <span>Takeout</span>
          </CardTitle>
          <Separator className="w-full" />
          <CardDescription className="space-y-1">
            Manage your applications and credentials here.
            <div className="flex items-center">
              <BackpackIcon className="w-4 h-4 mr-2" />

              <p className="font-semibold">{numApps} open applications</p>
            </div>
            <div className="flex items-center">
              <IdCardIcon className="w-4 h-4 mr-2" />
              <p className="font-semibold">{numCreds} credentials</p>
            </div>
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

export default TakeoutCard;
