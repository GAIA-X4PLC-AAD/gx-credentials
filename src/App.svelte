<script lang="ts">
  import { Router, Route, navigate } from 'svelte-navigator';
  import { Company, Home } from './routes';
  import './app.css';
  import Selection from './routes/Selection.svelte';
  import Employee from './routes/Employee.svelte';
  import AdminWindow from './routes/AdminWindow.svelte';
  import { disconnectWallet, userData } from './store';
</script>

<main>
  {#if $userData !== null}
    <header class="bg-white w-screen h-10">
      <div class="max-w-7xl mx-auto py-4 px-4 sm:px-6 flex justify-end">
        <button
          class="bg-orange-500 text-white hover:text-orange-500 hover:bg-white rounded-full py-2 px-4"
          on:click={() => {
            disconnectWallet();
            navigate('/');
          }}
        >
          Disconnect Wallet
        </button>
      </div>
    </header>
  {/if}

  <Router>
    <Route path="/">
      <Home />
    </Route>
    <Route path="/company">
      <Company />
    </Route>
    <Route path="/employee">
      <Employee />
    </Route>
    <Route path="/selection">
      <Selection />
    </Route>
    <Route path="/admin">
      <AdminWindow />
    </Route>
  </Router>
</main>

<style>
  :root {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
      Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
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

  h1 {
    color: #ff3e00;
    text-transform: uppercase;
    font-size: 4rem;
    font-weight: 300;
    line-height: 1.1;
    margin: 2rem auto;
    max-width: 14rem;
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
