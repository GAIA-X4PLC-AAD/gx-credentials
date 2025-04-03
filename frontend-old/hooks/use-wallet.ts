import { WalletContext } from "@/context/WalletContext";
import { useContext } from "react";

export function useWallet() {
  const context = useContext(WalletContext);

  if (!context) {
    throw new Error("useWallet must be used within a WalletProvider");
  }

  return context;
}
