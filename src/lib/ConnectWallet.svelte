<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import '../app.css';

  export let connected;

  const dispatch = createEventDispatcher();
</script>

{#if connected}
  <button on:click={() => dispatch('disconnect-wallet')}>
    Disconnect wallet
  </button>
{:else}
  <button on:click={() => dispatch('connect-wallet')}> Connect wallet </button>
{/if}

<style>
  button {
    font-family: inherit;
    font-size: inherit;
    padding: 1em 2em;
    color: #ff3e00;
    background-color: rgba(255, 62, 0, 0.1);
    border-radius: 2em;
    border: 2px solid rgba(255, 62, 0, 0);
    outline: none;
    width: 200px;
    font-variant-numeric: tabular-nums;
    cursor: pointer;
  }

  button:focus {
    border: 2px solid #ff3e00;
  }

  button:active {
    background-color: rgba(255, 62, 0, 0.2);
  }
</style>
