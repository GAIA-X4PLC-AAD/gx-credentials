import { DAppClient, NetworkType } from "@airgap/beacon-sdk";

const globalForWallet = global as unknown as {
  dAppClient: DAppClient | undefined;
};

export const dAppClient =
  globalForWallet.dAppClient ??
  new DAppClient({
    name: "GX Credentials",
    preferredNetwork: NetworkType.GHOSTNET,
  });

globalForWallet.dAppClient = dAppClient;
