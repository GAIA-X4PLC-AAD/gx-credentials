# Tezos Smart Contract

This smart contract is used by the trust anchor to delegate signing rights to administrative personnel, referred to as "registrars".

## Setup for Testing

For use, the contract must be published. Here, we describe how the smart contract can be published on the ghostnet testnet.

Set up `octez-client` following this guide: <https://ligolang.org/docs/tutorials/getting-started/?lang=jsligo#setting-up-the-octez-client-and-a-local-wallet>

Fund your new address with a faucet (e.g., <https://faucet.ghostnet.teztnets.com/>).

Create a file for the initial storage just named `storage`. This sets the owner of the contract and any initial registrars. It looks like this:

```jsligo
{owner:"tz1XXX" as address,registrars: Set.literal(["tz1YYY" as address,"tz1ZZZ" as address])}
```

Next, compile the contract:

```bash
./compile.sh
```

The next script publishes the contract. Make sure to replace `local_wallet` with your wallet name you set up:

```bash
./originate.sh local_wallet
```

The output shows you the address of your new contract, which should look something like "KT1...".
