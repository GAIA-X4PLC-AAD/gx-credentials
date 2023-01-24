<script lang="ts">
  import { onMount } from "svelte";
  import { TezosToolkit } from "@taquito/taquito";
  import { BeaconWallet } from "@taquito/beacon-wallet";
  import { NetworkType } from "@airgap/beacon-sdk";
  import logo from "./assets/svelte.png";
  import ContractCall from "./lib/ContractCall.svelte";
  import ConnectWallet from "./lib/ConnectWallet.svelte";

  const contractAddress = "KT1Vt5eFxzBbD7k2AJZhuJzaG6bA4GEyvNqi";
  const rpcUrl = "https://ghostnet.ecadinfra.com";
  let Tezos: TezosToolkit;
  let wallet: BeaconWallet;
  let userAddress = "";
  let simpleParam: null | number = null;

  const connectWallet = async () => {
    await wallet.requestPermissions({
      network: { type: NetworkType.GHOSTNET, rpcUrl },
    });
    userAddress = await wallet.getPKH();
    Tezos.setWalletProvider(wallet);
  };

  const disconnectWallet = async () => {
    wallet.client.destroy();
    wallet = undefined;
    userAddress = "";
  };

  onMount(async () => {
    Tezos = new TezosToolkit(rpcUrl);
    const contract = await Tezos.wallet.at(contractAddress);
    const storage: any = await contract.storage();
    simpleParam = storage.simple;

    wallet = new BeaconWallet({
      name: "Taquito Vitejs Test",
      preferredNetwork: NetworkType.GHOSTNET,
    });
    const activeAccount = await wallet.client.getActiveAccount();
    if (activeAccount) {
      userAddress = await wallet.getPKH();
      Tezos.setWalletProvider(wallet);
    }
  });
</script>

<main>
  <img src={logo} alt="Svelte Logo" />
  <h1>Taquito test with Vitejs</h1>
  <p>
    {simpleParam ? `Current counter: ${simpleParam}` : "Loading..."}
  </p>
  <br />
  <br />
  <ConnectWallet
    connected={!!userAddress}
    on:connect-wallet={connectWallet}
    on:disconnect-wallet={disconnectWallet}
  />
  <ContractCall {Tezos} {contractAddress} />
</main>

<style>
  :root {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
      Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  }

  main {
    text-align: center;
    padding: 1em;
    margin: 0 auto;
  }

  img {
    height: 16rem;
    width: 16rem;
  }

  h1 {
    color: #ff3e00;
    text-transform: uppercase;
    font-size: 4rem;
    font-weight: 100;
    line-height: 1.1;
    margin: 2rem auto;
    max-width: 14rem;
  }

  p {
    max-width: 14rem;
    margin: 1rem auto;
    line-height: 1.35;
    color: #ff3e00;
  }

  @media (min-width: 480px) {
    h1 {
      max-width: none;
    }

    p {
      max-width: none;
    }
  }
</style>
