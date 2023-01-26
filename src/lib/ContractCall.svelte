<script lang="ts">
  export let Tezos, contractAddress;

  const simpleParam = async () => {
    try {
      const contract = await Tezos.wallet.at(contractAddress);
      const op = await contract.methods.simple_param(5).send();
      await op.confirmation();
    } catch (error) {
      console.error(error);
    }
  };
</script>

<button on:click={simpleParam}> Send transaction </button>

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
