<script>
  import { generateCredential, userData } from '../store';
  import { useNavigate } from 'svelte-navigator';
  import { onMount } from 'svelte';
  import { db } from '../Firebase';
  import { doc, setDoc } from 'firebase/firestore/lite';
  import Modal from '../lib/Modal.svelte';
  const navigate = useNavigate();

  let modalType = 'success';
  let showModal = false;
  let message = 'Your credentials have been submitted for review.';

  if ($userData === null) {
    navigate('/');
  }

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
      status: 'pending',
    })
      .then(() => {
        console.log('Document successfully written!');
        showModal = true;
        setTimeout(() => {
          showModal = false;
          navigate('/selection');
        }, 3000);
      })
      .catch((error) => {
        showModal = true;
        modalType = 'error';
        message = 'There was an error adding your company credentials';
        console.error('Error adding document: ', error);
      });
  }
</script>

<main class="h-screen">
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
        type="url"
        id="url"
        bind:value={company.url}
        required
      />
    </div>
    <button>Submit</button>
  </form>
  <Modal {modalType} {showModal} {message} />
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
