"use client";

import { WalletProvider } from "@/context/WalletContext";
import { ReactNode } from "react";

export const WalletProviderWrapper = ({
  children,
}: {
  children: ReactNode;
}) => {
  return <WalletProvider>{children}</WalletProvider>;
};
