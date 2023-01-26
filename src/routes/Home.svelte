<script lang="ts">
  import ConnectWallet from '../lib/ConnectWallet.svelte';
  import { useNavigate } from 'svelte-navigator';
  import { disconnectWallet, initWallet, userData } from '../store';
  const navigate = useNavigate();

  // const connectWallet = async () => {
  //   await wallet.requestPermissions({
  //     network: { type: NetworkType.GHOSTNET, rpcUrl },
  //   });
  //   userAddress = await wallet.getPKH();
  //   Tezos.setWalletProvider(wallet);
  //   navigate('/input');
  // };

  // const disconnectWallet = async () => {
  //   wallet.client.destroy();
  //   wallet = undefined;
  //   userAddress = '';
  // };

  // onMount(async () => {
  //   Tezos = new TezosToolkit(rpcUrl);
  //   const contract = await Tezos.wallet.at(contractAddress);
  //   const storage: any = await contract.storage();
  //   simpleParam = storage.simple;

  //   wallet = new BeaconWallet({
  //     name: 'Taquito Vitejs Test',
  //     preferredNetwork: NetworkType.GHOSTNET,
  //   });
  //   const activeAccount = await wallet.client.getActiveAccount();
  //   if (activeAccount) {
  //     userAddress = await wallet.getPKH();
  //     Tezos.setWalletProvider(wallet);
  //   }
  // });
</script>

<main>
  <h1 class="font-semibold">Verifiable Credentials Generation</h1>
  <br />
  <ConnectWallet
    connected={$userData?.connected}
    on:connect-wallet={() => initWallet().then(() => navigate('/input'))}
    on:disconnect-wallet={() => disconnectWallet().then(() => navigate('/'))}
  />
  <!-- <ContractCall {Tezos} {contractAddress} /> -->
</main>

<!--
  <style>
    :root {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
        Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
    }

    main {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
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
      font-weight: 220;
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
  </style> -->
