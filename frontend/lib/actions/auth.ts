"use server";

import { signIn, signOut } from "@/auth";

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
  console.log("Logging in...");
  const { error } = await signIn("credentials", {
    pkh: activeAddress,
    pk: activePk,
    formattedInput,
    signature,
  });

  if (error) {
    console.error(error);
    return;
  }

  console.log("Login successful");
};

export const logout = async () => {
  await signOut({ redirectTo: "/" });
};
