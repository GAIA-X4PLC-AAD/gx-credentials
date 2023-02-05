<script>
  import { userData } from '../store';
  import { useNavigate } from 'svelte-navigator';
  import { fade } from 'svelte/transition';
  const navigate = useNavigate();

  if ($userData === null) {
    navigate('/');
  }

  let employee = {
    Name: '',
    Company: '',
  };
  console.log('data: ', $userData);

  function handleSubmit() {
    //   generateCredential($userData, employee).then(() => console.log('done'));
  }
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
      <label class="block text-gray-700 font-medium mb-2" for="company"
        >Company</label
      >
      <textarea
        class="border border-gray-400 p-2 rounded-lg w-full"
        id="company"
        bind:value={employee.description}
      />
    </div>
    <button
      class="bg-indigo-500 text-white py-2 px-4 rounded-lg hover:bg-indigo-600"
      >Submit</button
    >
  </form>
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
</style>
