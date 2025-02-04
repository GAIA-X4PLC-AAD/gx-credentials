import { DAppClient, PermissionResponseOutput } from "@airgap/beacon-sdk";

export interface WalletContextValue {
  dAppClient: DAppClient | undefined;
  requestRequiredPermissions: () => Promise<PermissionResponseOutput | undefined>;
  error: Error | null;
}
