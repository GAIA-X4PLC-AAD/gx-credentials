import {
  AccountInfo,
  DAppClient,
  PermissionResponseOutput,
} from "@airgap/beacon-sdk";

export interface WalletContextValue {
  dAppClient?: DAppClient;
  connect: () => Promise<PermissionResponseOutput | undefined>;
  disconnect: () => void;
  sign: (value: string) => Promise<string>;
  account: AccountInfo | undefined;
}
