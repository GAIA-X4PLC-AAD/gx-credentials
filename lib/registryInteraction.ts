import { ContractAbstraction, MichelsonMap } from "@taquito/taquito";
import { tezos } from "../config/tezos";
import { v5 as uuidv5 } from "uuid";
import { dAppClient } from "@/config/wallet";
import { TezosOperationType } from "@airgap/beacon-sdk";
import { log } from "console";

const contractAddress = process.env
  .NEXT_PUBLIC_TEZOS_REGISTRY_CONTRACT as string;

export const getRegistrars = async () => {
  return tezos.contract.at(contractAddress).then((contract) => {
    return contract.storage().then((storage: any) => {
      return [...storage.registrars, storage.owner];
    });
  });
};

export const writeTrustedIssuerLog = async (address: any) => {
  try {
    const hash = uuidv5(
      address,
      process.env.NEXT_PUBLIC_MY_NAMESPACE as string,
    );
    console.log("Hash of address: ", hash);

    const result = await dAppClient?.requestOperation({
      operationDetails: [
        {
          kind: TezosOperationType.TRANSACTION,
          destination: process.env
            .NEXT_PUBLIC_TEZOS_REGISTRY_CONTRACT as string,
          amount: "0",
          parameters: {
            entrypoint: "log_Issuance",
            value: { string: hash },
          },
        },
      ],
    });
    console.log("Result of log issuance: ", result);
  } catch (error) {
    console.log("Error writing to contract: ", error);
  }
};

export const getCredentialStatus = async (
  address: string,
): Promise<boolean> => {
  const contract = await tezos.contract.at(contractAddress);
  const storage: any = await contract.storage<{
    log: MichelsonMap<
      string,
      { issuance_time: string; issuer: string; status: Symbol }
    >;
    owner: string;
    registrars: string[];
  }>();
  console.log("Address: ", address);
  const hash = uuidv5(address, process.env.NEXT_PUBLIC_MY_NAMESPACE as string);
  console.log("Hash: ", hash);

  return storage.log.get(hash)?.status.active ? true : false;
};
