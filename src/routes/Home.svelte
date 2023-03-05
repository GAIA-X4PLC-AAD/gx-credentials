<script lang="ts">
  import ConnectWallet from '../lib/ConnectWallet.svelte';
  import { useNavigate } from 'svelte-navigator';
  import { disconnectWallet, initWallet, userData } from '../store';
  import { fly } from 'svelte/transition';
  import { collection, getDocs } from 'firebase/firestore/lite';
  import { db } from '../Firebase';
  const navigate = useNavigate();
</script>

<main class="flex flex-col justify-center items-center h-screen">
  <h1 in:fly={{ y: -200, duration: 1000 }} class="font-semibold">
    gx-credentials
  </h1>
  <i class="fas fa-watch mr-2 fa-2x" />
  <br />
  <ConnectWallet
    on:connect-wallet={() =>
      initWallet().then(async () => {
        const adminCol = collection(db, 'Admins');
        const adminSnapshot = await getDocs(adminCol);
        const admins = adminSnapshot.docs.map((doc) => doc.id);
        if (!admins.includes($userData?.account.address)) {
          navigate('/admin');
        } else {
          navigate('/selection');
        }
      })}
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
