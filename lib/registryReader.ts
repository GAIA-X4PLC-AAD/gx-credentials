import { ContractAbstraction } from "@taquito/taquito";
import { tezos } from "../config/tezos";

const contractAddress = process.env.TEZOS_REGISTRY_CONTRACT as string;

export const getRegistrars = async () => {
  return tezos.contract.at(contractAddress).then((contract) => {
    return contract.storage().then((storage: any) => {
      return [...storage.registrars, storage.owner];
    });
  });
};
