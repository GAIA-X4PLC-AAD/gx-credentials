/*
 * Copyright (C) 2023, Software Engineering for Business Information Systems (sebis) <matthes@tum.de>
 * SPDX-License-Identifier: Apache-2.0
 */
import { ContractAbstraction, MichelsonMap } from "@taquito/taquito";
import { tezos } from "../config/tezos";
import { v5 as uuidv5 } from "uuid";
import { dAppClient } from "@/config/wallet";
import { TezosOperationType } from "@airgap/beacon-sdk";
import { log } from "console";

const contractAddress = process.env
  .NEXT_PUBLIC_TEZOS_REGISTRY_CONTRACT as string;

export const getRegistrars = async () => {
  try {
    const contract = await tezos.contract.at(contractAddress);
    const storage: any = await contract.storage();
    return [...storage.registrars, storage.owner];
  } catch (error) {
    console.error("Failed to get registrars: ", error);
    throw error;
  }
};
