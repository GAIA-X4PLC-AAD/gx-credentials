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

if (!process.env.NEXT_PUBLIC_TEZOS_RPC_URL) {
  throw new Error("NEXT_PUBLIC_TEZOS_RPC_URL is not defined");
}
if (!process.env.NEXT_PUBLIC_TEZOS_REGISTRY_CONTRACT) {
  throw new Error("NEXT_PUBLIC_TEZOS_REGISTRY_CONTRACT is not defined");
}

const RPC_URL = process.env.NEXT_PUBLIC_TEZOS_RPC_URL;
const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_TEZOS_REGISTRY_CONTRACT;

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

async function addTrustedCompany(company_pkh: string): Promise<void> {
  try {
    const contract: ContractAbstraction<ContractProvider> =
      await tezos.contract.at(CONTRACT_ADDRESS);
    const op = await contract.methodsObject.add_company(company_pkh).send();
    await op.confirmation(1);
    console.log("Company added, hash:", op.hash);
  } catch (error) {
    console.error("Failed to add trusted company:", error);
    throw error;
  }
}

export { addTrustedCompany, getTrustAnchors, getTrustedCompanies, tezos };
