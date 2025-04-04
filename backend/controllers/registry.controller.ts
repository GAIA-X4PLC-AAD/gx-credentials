import {
  ContractAbstraction,
  ContractProvider,
  TezosToolkit,
} from "@taquito/taquito";

export interface RegistryStorage {
  registrars: string[];
  owner: string;
  companies: string[];
}

if (!process.env.TEZOS_RPC_URL) {
  throw new Error("TEZOS_RPC_URL is not defined");
}
if (!process.env.TEZOS_REGISTRY_CONTRACT) {
  throw new Error("TEZOS_REGISTRY_CONTRACT is not defined");
}

const RPC_URL = process.env.TEZOS_RPC_URL;
const CONTRACT_ADDRESS = process.env.TEZOS_REGISTRY_CONTRACT;

const tezos = new TezosToolkit(RPC_URL);

async function getRegistrars(): Promise<string[]> {
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

async function getTrustedCompanies(): Promise<string[]> {
  try {
    const contract: ContractAbstraction<ContractProvider> =
      await tezos.contract.at(CONTRACT_ADDRESS);
    const storage = await contract.storage<RegistryStorage>();
    return storage.companies || [];
  } catch (error) {
    console.error("Failed to get trusted companies:", error);
    throw error;
  }
}

export { getRegistrars, getTrustedCompanies };
