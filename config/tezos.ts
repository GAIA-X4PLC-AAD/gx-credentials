import { TezosToolkit } from "@taquito/taquito";

const rpcUrl = process.env.TEZOS_RPC_URL as string;

const tezos: TezosToolkit = new TezosToolkit(rpcUrl);

export { tezos };
