/*
 * Copyright (C) 2023, Software Engineering for Business Information Systems (sebis) <matthes@tum.de>
 * SPDX-License-Identifier: Apache-2.0
 */
import { TezosToolkit } from "@taquito/taquito";

const rpcUrl = process.env.NEXT_PUBLIC_TEZOS_RPC_URL as string;

const tezos: TezosToolkit = new TezosToolkit(rpcUrl);

export { tezos };
