<script lang="ts">
  import ConnectWallet from '../lib/ConnectWallet.svelte';
  import { useNavigate } from 'svelte-navigator';
  import { disconnectWallet, initWallet, userData } from '../store';
  import { fly } from 'svelte/transition';
  const navigate = useNavigate();
</script>

<main class="flex flex-col justify-center items-center h-screen">
  <h1 transition:fly={{ y: -200, duration: 2000 }} class="font-semibold">
    gx-credentials
  </h1>
  <i class="fas fa-watch mr-2 fa-2x" />
  <br />
  <ConnectWallet
    connected={$userData?.connected}
    on:connect-wallet={() => initWallet().then(() => navigate('/selection'))}
    on:disconnect-wallet={() => disconnectWallet().then(() => navigate('/'))}
  />
</main>

<style>
  h1 {
    color: #ff3e00;
    text-transform: uppercase;
    font-size: 4rem;
    font-weight: 300;
    line-height: 1.1;
    margin: 2rem auto;
    max-width: 14rem;
    outline: none;
  }

  @media (min-width: 480px) {
    h1 {
      max-width: none;
    }
  }
</style>
