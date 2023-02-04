<!-- Modal.svelte -->
<script>
  export let showModal = false;
  export let modalType = 'success';
  export let message = '';
</script>

{#if showModal}
  <div class="fixed top-0 left-0 bottom-0 right-0 bg-gray-200 p-8">
    <div class="bg-white rounded-lg p-8">
      <span class="text-xl font-bold">
        {#if modalType === 'success'}
          <p>Success!</p>
          <span
            class="bg-green-500 rounded-full h-10 w-10 flex items-center justify-center inline-block align-baseline"
          >
            <i class="fas fa-check text-white" />
          </span>
        {:else}
          <p>Error!</p>
          <p
            class="bg-red-500 rounded-full h-10 w-10 flex items-center justify-center inline-block align-middle"
          >
            <i class="fas fa-times text-white" />
          </p>
        {/if}
      </span>

      <p class="text-gray-600">{message}</p>
    </div>
  </div>
{/if}
