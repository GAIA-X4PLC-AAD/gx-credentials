"use server";

import { signIn, signOut } from "@/auth";
import { DAppClient } from "@airgap/beacon-sdk";

type LoginProps = {
  activeAddress?: string;
  activePk?: string;
  formattedInput?: string;
  signature?: string;
};

export const login = async ({
  activeAddress,
  activePk,
  formattedInput,
  signature,
}: LoginProps) => {
  const callbackUrl = "/home";
  await signIn("credentials", {
    pkh: activeAddress,
    pk: activePk,
    formattedInput,
    signature,
    redirectTo: callbackUrl,
  });
};

export const logout = async (dAppClient?: DAppClient) => {
  await signOut({ redirectTo: "/" });
  await dAppClient?.clearActiveAccount();
};
