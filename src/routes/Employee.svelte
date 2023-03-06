<script>
  import { getTrustedIssuers, userData } from '../store';
  import { useNavigate } from 'svelte-navigator';
  import { fade } from 'svelte/transition';
  import { db } from '../Firebase';
  import { doc, setDoc } from 'firebase/firestore/lite';
  import { onMount } from 'svelte';
  const navigate = useNavigate();

  if ($userData === null) {
    navigate('/');
  }

  let showModal = false;
  let type = 'success';

  let employee = {
    name: '',
    company: '',
  };
  console.log('data: ', $userData);

  function handleSubmit() {
    setDoc(doc(db, 'EmployeeCredentials', $userData.account.address), {
      name: employee.name,
      company: employee.company,
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
      navigate('/selection');
    }, 3000);
  }
  let trustedIssuers = [];
  onMount(async () => {
    trustedIssuers = await getTrustedIssuers();
  });
</script>

<main class="h-screen" transition:fade={{ duration: 2000 }}>
  <form
    class="bg-white p-6 rounded-lg shadow-md flex flex-col items-center"
    on:submit|preventDefault={handleSubmit}
  >
    <h2 class="text-lg font-medium mb-4">Apply for Employee Credentials</h2>
    <div class="mb-4">
      <label class="block text-gray-700 font-medium mb-2" for="employee-name"
        >Name</label
      >
      <input
        class="border border-gray-400 p-2 rounded-lg w-full"
        type="text"
        id="employee-name"
        bind:value={employee.name}
      />
    </div>
    <div class="mb-4">
      <label class="block font-medium text-gray-700 mb-2" for="company">
        Companies
      </label>
      <select
        id="company"
        name="company"
        class="px-4 py-2 pr-8 bg-white border border-gray-400 rounded appearance-none focus:outline-none focus:bg-white focus:border-gray-500"
        bind:value={employee.company}
      >
        {#each trustedIssuers as issuer}
          <option value={issuer.companyAddress}>{issuer.companyName}</option>
        {/each}
      </select>
    </div>
    <button
      class="bg-indigo-500 text-white py-2 px-4 rounded-lg hover:bg-indigo-600"
      >Submit</button
    >
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
    outline: none;
  }
</style>
