"use client";

import { createContext } from "react";

import { WalletContextValue } from "@/types/wallet";

const DEFAULT_CONTEXT: WalletContextValue = {
  dAppClient: undefined,
  connect: async () => {
    console.log("not loaded");
    return Promise.resolve(undefined);
  },
  disconnect: () => {
    console.log("not loaded");
  },
  sign: async () => {
    return "";
  },
  account: undefined,
};

export const WalletContext = createContext<WalletContextValue>(DEFAULT_CONTEXT);
