"use client";

import { logout } from "@/lib/actions/auth";
import { ExitIcon } from "@radix-ui/react-icons";
import { Session } from "next-auth";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { ModeToggle } from "./mode-toggle";
import { Button } from "./ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Skeleton } from "./ui/skeleton";

export function Header() {
  const { data: session, status } = useSession();
  return (
    <header className="flex justify-between py-4 container ">
      <div className="mr-4 hidden md:flex">
        <Link
          href={session ? "/home" : "/"}
          className="mr-6 flex items-center space-x-2"
        >
          <span className="hidden font-bold sm:inline-block">
            GX Credentials
          </span>
        </Link>
      </div>
      <div className="flex items-centers space-x-4">
        {status === "loading" ? (
          <Skeleton className="w-20 h-8" />
        ) : session && status === "authenticated" ? (
          <ProfileMenu session={session} />
        ) : (
          <Link href="/app" className="mr-6 flex items-center space-x-2">
            <span className="hidden font-bold sm:inline-block">Login</span>
          </Link>
        )}
        <ModeToggle />
      </div>
    </header>
  );
}

function ProfileMenu({ session }: { session: Session }) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="max-w-32">
          <code className="inline-block truncate">{session.user?.pkh}</code>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full space-y-4">
        <div className="grid gap-2">
          <p className="font-semibold">Logged in as:</p>{" "}
          <code className="inline-block w-auto bg-secondary px-1 rounded-md">
            {session.user?.pkh}
          </code>
        </div>
        <Button variant="secondary" onClick={() => logout()} className="w-full">
          <ExitIcon className="w-4 h-4 mr-2" />
          Logout
        </Button>
      </PopoverContent>
    </Popover>
  );
}
