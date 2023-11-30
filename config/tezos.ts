/*
 * Copyright (C) 2023, Software Engineering for Business Information Systems (sebis) <matthes@tum.de>
 * SPDX-License-Identifier: Apache-2.0
 */
import { TezosToolkit } from "@taquito/taquito";
import { RpcClient, RpcClientCache } from "@taquito/rpc";

const rpcUrl = process.env.NEXT_PUBLIC_TEZOS_RPC_URL as string;

const rpc = new RpcClient(rpcUrl);
// RpcClientCache improves the performance of the RPC client by caching the results of the RPC calls.
// https://tezostaquito.io/docs/rpc-cache/
const tezos: TezosToolkit = new TezosToolkit(new RpcClientCache(rpc));

export { tezos };
