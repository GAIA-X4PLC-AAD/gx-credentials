"use client";

import { DAppClient, NetworkType } from "@airgap/beacon-sdk";

export const WALLET_CONFIG = {
  name: "GX Credentials",
  network: NetworkType.GHOSTNET,
  rpcUrl: process.env.NEXT_PUBLIC_TEZOS_RPC_URL,
} as const;

export const createDAppClient = () => {
  if (typeof window === "undefined") return undefined;

  return new DAppClient({
    name: WALLET_CONFIG.name,
    preferredNetwork: WALLET_CONFIG.network,
  });
};
