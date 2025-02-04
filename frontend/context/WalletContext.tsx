"use client";

import { createDAppClient, WALLET_CONFIG } from "@/config/wallet";
import { useToast } from "@/hooks/use-toast";
import { WalletContextValue } from "@/types/wallet";
import { createContext, useEffect, useState } from "react";

const dAppClient: ReturnType<typeof createDAppClient> = createDAppClient();

const DEFAULT_CONTEXT: WalletContextValue = {
  dAppClient,
  requestRequiredPermissions: async () => undefined,
  error: null,
};

export const WalletContext = createContext<WalletContextValue>(DEFAULT_CONTEXT);

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const initialize = async (): Promise<void> => {
      if (!dAppClient) return;

      try {
        await dAppClient.clearActiveAccount();
      } catch (err) {
        setError(
          err instanceof Error
            ? err
            : new Error("Failed to clear active account")
        );
        console.error("Clear active account error:", err);
        void toast({
          title: "Error",
          description: "Failed to clear active account",
          variant: "destructive",
        });
      }
    };

    initialize();

    // Cleanup function
    return () => {
      setError(null);
    };
  }, []);

  const requestRequiredPermissions = async () => {
    if (!dAppClient) return undefined;

    try {
      setError(null);
      return await dAppClient.requestPermissions({
        network: {
          type: WALLET_CONFIG.network,
          rpcUrl: WALLET_CONFIG.rpcUrl,
        },
      });
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("Failed to request permissions")
      );
      console.error("Permission request error:", err);
      return undefined;
    }
  };

  return (
    <WalletContext.Provider
      value={{
        dAppClient,
        requestRequiredPermissions,
        error,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}
