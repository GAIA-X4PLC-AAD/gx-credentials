"use client";

import type { AccountInfo, RequestSignPayloadInput } from "@airgap/beacon-sdk";
import { DAppClient, BeaconEvent, SigningType } from "@airgap/beacon-sdk";
import { useCallback, useEffect, useState, useRef } from "react";

import { WALLET_CONFIG } from "@/config/wallet";
import { payloadBytesFromString } from "@/lib/utils";
import { WalletContext } from "@/context/WalletContext";

export default function WalletProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const dAppClientRef = useRef<DAppClient | null>(null);
  const [account, setAccount] = useState<AccountInfo>();

  useEffect(() => {
    if (!dAppClientRef.current) {
      const client = new DAppClient({
        name: WALLET_CONFIG.name,
        preferredNetwork: WALLET_CONFIG.network,
      });

      client.subscribeToEvent(BeaconEvent.ACTIVE_ACCOUNT_SET, account => {
        console.log(`${BeaconEvent.ACTIVE_ACCOUNT_SET} triggered: `, account);
      });

      dAppClientRef.current = client;
      client.getActiveAccount().then(setAccount);
    }
  }, []);

  const connect = useCallback(async () => {
    try {
      const permissions = await dAppClientRef.current?.requestPermissions({
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
  }, []);

  const disconnect = useCallback(() => {
    dAppClientRef.current?.clearActiveAccount().then(async () => {
      setAccount(await dAppClientRef.current?.getActiveAccount());
    });
  }, []);

  const sign = useCallback(
    (value: string) => {
      return new Promise<string>((resolve, reject) => {
        try {
          const payloadBytes = payloadBytesFromString(value);
          const payload: RequestSignPayloadInput = {
            signingType: SigningType.MICHELINE,
            payload: payloadBytes,
            sourceAddress: account?.address,
          };
          return dAppClientRef.current
            ?.requestSignPayload(payload)
            .then(result => {
              resolve(result.signature);
            });
        } catch (e) {
          reject(e);
        }
      });
    },
    [account]
  );

  return (
    <WalletContext.Provider
      value={{
        dAppClient: dAppClientRef.current || undefined,
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
