"use client";

import { WALLET_CONFIG } from "@/config/wallet";
import { payloadBytesFromString } from "@/lib/payload";
import { WalletContextValue } from "@/types/wallet";
import type {
  AccountInfo,
  DAppClient,
  RequestSignPayloadInput,
} from "@airgap/beacon-sdk";
import { createContext, useCallback, useEffect, useState } from "react";

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

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [dAppClient, setDAppClient] = useState<DAppClient>();
  const [account, setAccount] = useState<AccountInfo>();

  useEffect(() => {
    let mounted = true;

    const initDAppClient = async () => {
      if (!dAppClient) {
        const { DAppClient } = await import("@airgap/beacon-sdk");
        if (mounted) {
          const client = new DAppClient({
            name: WALLET_CONFIG.name,
            preferredNetwork: WALLET_CONFIG.network,
          });
          setDAppClient(client);
          const activeAccount = await client.getActiveAccount();
          setAccount(activeAccount);
        }
      }
    };

    initDAppClient();

    return () => {
      mounted = false;
    };
  }, [dAppClient]);

  const connect = useCallback(() => {
    const requestPermissions = (async () => {
      try {
        const permissions = await dAppClient?.requestPermissions({
          network: {
            type: WALLET_CONFIG.network,
            rpcUrl: WALLET_CONFIG.rpcUrl,
          },
        });
        console.log(permissions);
        setAccount(permissions?.accountInfo);
        return permissions;
      } catch (e) {
        console.error(e);
      }
    })();
    return requestPermissions;
  }, [dAppClient]);

  const disconnect = useCallback(() => {
    dAppClient?.clearActiveAccount().then(async () => {
      setAccount(await dAppClient.getActiveAccount());
    });
  }, [dAppClient]);

  const sign = useCallback(
    (value: string) => {
      return new Promise<string>(async (resolve, reject) => {
        try {
          const { SigningType } = await import("@airgap/beacon-sdk");
          const payloadBytes = payloadBytesFromString(value);
          const payload: RequestSignPayloadInput = {
            signingType: SigningType.MICHELINE,
            payload: payloadBytes,
            sourceAddress: account?.address,
          };
          const sig = await dAppClient?.requestSignPayload(payload);
          return sig?.signature || "Unknown error";
        } catch (e) {
          reject(e);
        }
      });
    },
    [dAppClient, account],
  );

  return (
    <WalletContext.Provider
      value={{
        dAppClient,
        connect,
        disconnect,
        sign,
        account,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}
