import { useSession, signOut } from "next-auth/react";
import { useEffect } from "react";
import { dAppClient } from "../config/wallet";

export function useProtected() {
  // TODO: can the session be terminated somehow from the wallet side?

  const handleSignout = async () => {
    await signOut({ callbackUrl: "/" });
    await dAppClient!.clearActiveAccount();
  };

  return handleSignout;
}
