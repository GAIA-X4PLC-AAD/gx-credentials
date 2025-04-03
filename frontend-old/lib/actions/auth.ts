"use client";

import { signIn, signOut } from "next-auth/react";

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
  const response = await signIn("credentials", {
    pkh: activeAddress,
    pk: activePk,
    formattedInput,
    signature,
    redirectTo: "/home",
  });

  if (!response?.ok) {
    console.error("Login failed", response?.error);
    return;
  }

  console.log("Login successful");
};

export const logout = async () => {
  await signOut({ redirectTo: "/" });
};
