<!-- <div class="flex justify-center align-middle">
<form class="bg-white p-6 rounded-lg shadow-md flex flex-col items-center">
    <h2 class="text-lg font-medium mb-4">Add Your Company</h2>
    <div class="mb-4">
      <label class="block text-gray-700 font-medium mb-2" for="company-name">Company Name</label>
      <input class="border border-gray-400 p-2 rounded-lg w-full" type="text" id="company-name" name="company-name">
    </div>
    <div class="mb-4">
      <label class="block text-gray-700 font-medium mb-2" for="description">Description</label>
      <textarea class="border border-gray-400 p-2 rounded-lg w-full" id="description" name="description"></textarea>
    </div>
    <div class="mb-4">
      <label class="block text-gray-700 font-medium mb-2" for="url">URL</label>
      <input class="border border-gray-400 p-2 rounded-lg w-full" type="url" id="url" name="url">
    </div>
    <button class="bg-indigo-500 text-white py-2 px-4 rounded-lg hover:bg-indigo-600">Submit</button>
  </form>
</div> -->
<script>
  import { generateCredential, userData } from '../store';
  import { useNavigate } from 'svelte-navigator';
  const navigate = useNavigate();

  if ($userData === null) {
    navigate('/');
  }

  let company = {
    name: '',
    description: '',
    url: '',
  };
  console.log('data: ', $userData);

  function handleSubmit() {
    generateCredential($userData, company).then(() => console.log('done'));
  }
</script>

<div class="flex justify-center align-middle">
  <form
    class="bg-white p-6 rounded-lg shadow-md flex flex-col items-center"
    on:submit|preventDefault={handleSubmit}
  >
    <h2 class="text-lg font-medium mb-4">Add Your Company</h2>
    <div class="mb-4">
      <label class="block text-gray-700 font-medium mb-2" for="company-name"
        >Company Name</label
      >
      <input
        class="border border-gray-400 p-2 rounded-lg w-full"
        type="text"
        id="company-name"
        bind:value={company.name}
      />
    </div>
    <div class="mb-4">
      <label class="block text-gray-700 font-medium mb-2" for="description"
        >Description</label
      >
      <textarea
        class="border border-gray-400 p-2 rounded-lg w-full"
        id="description"
        bind:value={company.description}
      />
    </div>
    <div class="mb-4">
      <label class="block text-gray-700 font-medium mb-2" for="url">URL</label>
      <input
        class="border border-gray-400 p-2 rounded-lg w-full"
        type="url"
        id="url"
        bind:value={company.url}
      />
    </div>
    <button
      class="bg-indigo-500 text-white py-2 px-4 rounded-lg hover:bg-indigo-600"
      >Submit</button
    >
  </form>
</div>
