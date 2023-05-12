const { TezosToolkit } = require("@taquito/taquito");

// TODO put these into the env file
const rpcUrl = "https://ghostnet.ecadinfra.com";
const contractAddress = "KT1SPi4MKAGzvCbmULaL5heHA74mBaPwVuGC";

const tezos = new TezosToolkit(rpcUrl);

// TODO function to find company that a given issuer is part of
