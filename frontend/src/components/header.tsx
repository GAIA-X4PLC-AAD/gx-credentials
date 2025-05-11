"use client";

import { ExitIcon } from "@radix-ui/react-icons";
import { Link } from "react-router";
import { useNavigate } from "react-router";

import { ModeToggle } from "./mode-toggle";
import { Button } from "./ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

import { useSession } from "@/hooks/use-session";
import { useWallet } from "@/hooks/use-wallet";
import { SessionContextValue } from "@/types/session";

export function Header() {
  const session = useSession();
  return (
    <header className="flex justify-between py-4">
      <div className="mr-4 flex">
        <Link
          to={session.user ? "/home" : "/"}
          className="mr-6 flex items-center space-x-1 transition-all duration-300 hover:scale-105"
        >
          <>
            <span className="font-bold text-purple-500">GX</span>
            <span className="font-bold"> Credentials</span>
          </>
        </Link>
      </div>
      <div className="items-centers flex space-x-4">
        {session.user ? (
          <ProfileMenu session={session} />
        ) : (
          <Link to="/" className="mr-6 flex items-center space-x-2">
            <span className="font-bold sm:inline-block">Login</span>
          </Link>
        )}
        <ModeToggle />
      </div>
    </header>
  );
}

function ProfileMenu({ session }: { session: SessionContextValue }) {
  const { disconnect } = useWallet();
  const navigate = useNavigate();

  const handleLogout = async () => {
    disconnect();
    await session.logout();
    navigate("/");
  };
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button className="max-w-32">
          <code className="inline-block truncate">{session.user?.pkh}</code>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full space-y-4">
        <div className="grid gap-2">
          <p className="font-semibold">Logged in as:</p>{" "}
          <code className="inline-block w-auto rounded-md bg-secondary px-1">
            {session.user?.pkh}
          </code>
        </div>
        <Button
          variant="secondary"
          onClick={() => handleLogout()}
          className="w-full"
        >
          <ExitIcon className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </PopoverContent>
    </Popover>
  );
}
