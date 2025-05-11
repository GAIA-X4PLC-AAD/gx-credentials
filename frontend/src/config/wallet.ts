"use client";

import type { NetworkType } from "@airgap/beacon-sdk";

export const WALLET_CONFIG = {
  name: "GX Credentials",
  network: "ghostnet" as NetworkType,
  rpcUrl: import.meta.env.VITE_PUBLIC_TEZOS_RPC_URL,
} as const;
