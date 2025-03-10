import {
  ContractAbstraction,
  ContractProvider,
  TezosToolkit,
} from "@taquito/taquito";

export interface RegistryStorage {
  registrars: string[];
  owner: string;
}

const RPC_URL = process.env.NEXT_PUBLIC_TEZOS_RPC_URL as string;
const CONTRACT_ADDRESS = process.env
  .NEXT_PUBLIC_TEZOS_REGISTRY_CONTRACT as string;

const tezos = new TezosToolkit(RPC_URL);

async function getTrustAnchors(): Promise<string[]> {
  try {
    const contract: ContractAbstraction<ContractProvider> =
      await tezos.contract.at(CONTRACT_ADDRESS);
    const storage = await contract.storage<RegistryStorage>();

    return [...storage.registrars, storage.owner];
  } catch (error) {
    console.error("Failed to get registrars:", error);
    throw error;
  }
}

export { getTrustAnchors, tezos };
