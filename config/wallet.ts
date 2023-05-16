import { DAppClient, NetworkType } from "@airgap/beacon-sdk";

const globalForWallet = global as unknown as {
  dAppClient: DAppClient | undefined;
};

function isServer() {
  if (typeof window === "undefined") return true;
  return false;
}

export const dAppClient =
  globalForWallet.dAppClient ??
  (isServer()
    ? undefined
    : new DAppClient({
        name: "GX Credentials",
        preferredNetwork: NetworkType.GHOSTNET,
      }));

globalForWallet.dAppClient = dAppClient;
