<script>
  import { userData } from '../store';
  import { useNavigate } from 'svelte-navigator';
  import { onMount } from 'svelte';
  import { db } from '../Firebase';
  import { doc, setDoc } from 'firebase/firestore/lite';
  import { fade } from 'svelte/transition';
  const navigate = useNavigate();

  if ($userData === null) {
    navigate('/');
  }

  let type = 'success';
  let showModal = false;

  let company = {
    name: '',
    description: '',
    url: '',
  };

  function handleSubmit() {
    setDoc(doc(db, 'CompanyCredentials', $userData.account.address), {
      name: company.name,
      description: company.description,
      url: company.url,
      address: $userData.account.address,
      publicKey: $userData.account.publicKey,
      status: 'Pending',
    })
      .then(() => {
        console.log('Document successfully written!');
        showModal = !showModal;
      })
      .catch((error) => {
        showModal = !showModal;
        type = 'error';
        console.error('Error adding document: ', error);
      });
    setTimeout(() => {
      showModal = false;
      navigate('/selection');
    }, 3000);
  }
</script>

<main class="h-screen" transition:fade={{ duration: 2000 }}>
  <form
    class="bg-white p-6 rounded-lg shadow-md flex flex-col items-center"
    on:submit|preventDefault={handleSubmit}
  >
    <h2 class="text-2xl font-medium mb-4 text-orange-600 ">Add Your Company</h2>
    <div class="mb-4">
      <label class="block text-orange-600 mb-2" for="company-name"
        >Company Name</label
      >
      <input
        class="border border-orange-600 p-2 rounded-lg w-full"
        type="text"
        id="company-name"
        bind:value={company.name}
        required
      />
    </div>
    <div class="mb-4">
      <label class="block text-orange-600 mb-2" for="description"
        >Description</label
      >
      <textarea
        class="border border-orange-600 p-2 rounded-lg w-full"
        id="description"
        bind:value={company.description}
        required
      />
    </div>
    <div class="mb-4">
      <label class="block text-orange-600  mb-2" for="url">URL</label>
      <input
        class="border border-orange-600 p-2 rounded-lg w-full"
        id="url"
        bind:value={company.url}
        required
      />
    </div>
    <button>Submit</button>
  </form>
  {#if showModal}
    <div class="fixed top-0 left-0 right-0 bottom-0 z-10 bg-white p-8">
      <div class="text-center">
        {#if type === 'success'}
          <i class="fas fa-check text-green-500" />
          <p class="text-green-500">Successfully applied for VC.</p>
        {:else}
          <i class="fas fa-times text-red-500" />
          <p class="text-red-500">Error applying for VC.</p>
        {/if}
      </div>
    </div>
  {/if}
</main>

<style>
  main {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 1em;
    margin: 0 auto;
  }

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
    outline: none;
  }
  button:hover {
    background-color: rgba(255, 62, 0, 0.2);
  }

  button:focus {
    border: 2px solid #ff3e00;
  }

  button:active {
    background-color: rgba(255, 62, 0, 0.2);
  }
</style>
