<script lang="ts">
  import { navigate } from 'svelte-navigator';
</script>

<main class="flex justify-center items-center h-screen">
  <button
    on:click={() => navigate('/company')}
    class="p-8 bg-orange-500 hover:bg-orange-600 shadow-lg rounded-lg text-center text-white w-64 transition duration-300 ease-in-out transform hover:scale-105"
  >
    Generate Company Credentials
  </button>
  <button
    on:click={() => navigate('/employee')}
    class="p-8 bg-orange-500 hover:bg-orange-600 shadow-lg rounded-lg text-center text-white w-64 ml-8 transition duration-300 ease-in-out transform hover:scale-105"
  >
    Generate Employee Credential
  </button>
</main>
