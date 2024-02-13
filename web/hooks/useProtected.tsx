/*
 * Copyright (C) 2023, Software Engineering for Business Information Systems (sebis) <matthes@tum.de>
 * SPDX-License-Identifier: Apache-2.0
 */
import { signOut } from "next-auth/react";
import { dAppClient } from "../config/wallet";

export function useProtected(): () => Promise<void> {
  // TODO: can the session be terminated somehow from the wallet side?

  const handleSignout = async (): Promise<void> => {
    await signOut({ callbackUrl: "/" });
    await dAppClient?.clearActiveAccount();
  };

  return handleSignout;
}
