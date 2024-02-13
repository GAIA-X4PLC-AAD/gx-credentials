/*
 * Copyright (C) 2023, Software Engineering for Business Information Systems (sebis) <matthes@tum.de>
 * SPDX-License-Identifier: Apache-2.0
 */
import { tezos } from "../config/tezos";

const contractAddress = process.env
  .NEXT_PUBLIC_TEZOS_REGISTRY_CONTRACT as string;

export const getRegistrars = async (): Promise<string[]> => {
  try {
    const contract = await tezos.contract.at(contractAddress);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const storage: any = await contract.storage();
    return [...storage.registrars, storage.owner];
  } catch (error) {
    console.error("Failed to get registrars: ", error);
    throw error;
  }
};
