"use client";

import { NetworkType } from "@airgap/beacon-sdk";

export const WALLET_CONFIG = {
  name: "GX Credentials",
  network: NetworkType.GHOSTNET,
  rpcUrl: process.env.NEXT_PUBLIC_TEZOS_RPC_URL,
} as const;
