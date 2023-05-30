import { ContractAbstraction } from "@taquito/taquito";
import { tezos } from "../config/tezos";
import { v5 as uuidv5 } from 'uuid';

const contractAddress = process.env.TEZOS_REGISTRY_CONTRACT as string;

export const getRegistrars = async () => {
  return tezos.contract.at(contractAddress).then((contract) => {
    return contract.storage().then((storage: any) => {
      return [...storage.registrars, storage.owner];
    });
  });
};


export const writeTrusterIssuerLog = async (companyApplication: any) => {
  try {
    tezos.contract.at(contractAddress).then((contract) => {
      let methods = contract.parameterSchema.ExtractSignatures();
      console.log("Methods: ", methods);
      const hash = uuidv5(companyApplication.address, process.env.MY_NAMESPACE);
      console.log("Hash: ", hash);
      contract.methods.log_issuance(hash)
    });
  } catch (error) {
    console.log("Error writing to contract: ", error);
  }
}

export const getCredentialStatus = async (address: any) => {
  tezos.contract.at(contractAddress).then((contract) => {
    return contract.storage().then((storage: any) => {
      console.log("Storage: ", storage);
    });
  });
}