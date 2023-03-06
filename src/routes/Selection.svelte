<script lang="ts">
  import { navigate } from 'svelte-navigator';
  import { collection, doc, getDocs, updateDoc } from 'firebase/firestore/lite';
  import { db } from '../Firebase';
  import { onMount } from 'svelte';
  import {
    userData,
    downloadCompanyVC,
    downloadEmployeeVC,
    generateEmployeeCredential,
  } from '../store';
  import { fade } from 'svelte/transition';

  let companyCredentials = [];
  let employeeCredentials = [];
  let employeeStatus = 'NA'; //NA, Approved, Rejected
  let companyStatus = 'NA'; //NA, Approved, Rejected
  let filteredCredentials = [];

  if ($userData === null) {
    navigate('/');
  }

  const updateStatus = async (event, info, client) => {
    const docRef = doc(db, client, info.address);
    if (docRef) {
      if (event.target.id === 'accept') {
        await generateEmployeeCredential(info, $userData?.account.publicKey);
        await updateDoc(docRef, { status: 'Approved' });
      }
      if (event.target.id === 'reject') {
        await updateDoc(docRef, { status: 'Rejected' });
      }
    }
  };

  onMount(async () => {
    const companyCol = collection(db, 'CompanyCredentials');
    const companySnapshot = await getDocs(companyCol);
    companyCredentials = companySnapshot.docs.map((doc) => doc.data());

    const employeeCol = collection(db, 'EmployeeCredentials');
    const employeeSnapshot = await getDocs(employeeCol);
    employeeCredentials = employeeSnapshot.docs.map((doc) => doc.data());
  });

  $: companyCredentials?.forEach((element) => {
    if (element.address === $userData?.account.address) {
      companyStatus = element.status;
    }
  });

  $: {
    employeeCredentials?.forEach((element) => {
      if (element.address === $userData?.account.address) {
        employeeStatus = element.status;
      }
      if (element.company === $userData?.account.address) {
        filteredCredentials.push(element);
      }
    });
    filteredCredentials = filteredCredentials;
  }
  $: console.log(filteredCredentials);
</script>

<main
  class="flex flex-col justify-center items-center h-screen"
  transition:fade={{ duration: 2000 }}
>
  <div class="flex mb-4">
    {#if employeeStatus !== 'Approved' && employeeStatus !== 'Pending'}
      {#if companyStatus === 'Approved'}
        <button
          class="p-8 bg-green-500 hover:bg-green-600 shadow-lg rounded-lg text-center text-white w-64"
          transition:fade={{ duration: 2000 }}
          on:click={() => downloadCompanyVC($userData?.account.address)}
        >
          <div class="flex items-center">
            <i class="fas fa-download text-white" />
            <span class="text-white"
              >Download Approved Company Credentials.</span
            >
          </div>
        </button>
      {:else if companyStatus === 'Rejected'}
        <button
          class="p-8 bg-red-500 hover:bg-red-600 shadow-lg rounded-lg text-center text-white w-64"
          transition:fade={{ duration: 2000 }}
        >
          <div class="flex items-center">
            <i class="fas fa-times text-white" />
            <span class="text-white">Company Credentials Rejected.</span>
          </div>
        </button>
      {:else if companyStatus === 'Pending'}
        <button
          class="p-8 bg-orange-500 hover:bg-orange-600 shadow-lg rounded-lg text-center text-white w-64"
          transition:fade={{ duration: 2000 }}
        >
          <div class="flex items-center">
            <i class="fa fa-clock text-white mr-2" />
            <span class="text-white"
              >Pending Approval for Company Credentials</span
            >
          </div>
        </button>
      {:else}
        <button
          on:click={() => navigate('/company')}
          class="p-8 bg-orange-500 hover:bg-orange-600 shadow-lg rounded-lg text-center text-white w-64 ml-8 transition duration-300 ease-in-out transform hover:scale-105"
          transition:fade={{ duration: 2000 }}
        >
          Apply to Company Credential
        </button>
      {/if}
    {/if}

    <!-- Checking employee status -->
    {#if companyStatus !== 'Approved' && companyStatus !== 'Pending'}
      {#if employeeStatus === 'Approved'}
        <button
          class="p-8 bg-green-500 hover:bg-green-600 shadow-lg rounded-lg text-center text-white w-64 ml-8"
          on:click={() => downloadEmployeeVC($userData?.account.address)}
          transition:fade={{ duration: 2000 }}
        >
          <div class="flex items-center">
            <i class="fas fa-download text-white " />
            <span class="text-white"
              >Download Approved Employee Credentials.</span
            >
          </div>
        </button>
      {:else if employeeStatus === 'Rejected'}
        <button
          class="p-8 bg-red-500 hover:bg-red-600 shadow-lg rounded-lg text-center text-white w-64 ml-8"
          transition:fade={{ duration: 2000 }}
        >
          <div class="flex items-center">
            <i class="fas fa-times text-white" />
            <span class="text-white">Employee Credentials Rejected</span>
          </div>
        </button>
      {:else if employeeStatus === 'Pending'}
        <button
          class="p-8 bg-orange-500 hover:bg-orange-600 shadow-lg rounded-lg text-center text-white w-64 ml-8"
          transition:fade={{ duration: 2000 }}
        >
          <div class="flex items-center">
            <i class="fa fa-clock text-white mr-2" />
            <span class="text-white"
              >Pending Approval for Employee Credentials</span
            >
          </div>
        </button>
      {:else}
        <button
          on:click={() => navigate('/employee')}
          class="p-8 bg-orange-500 hover:bg-orange-600 shadow-lg rounded-lg text-center text-white w-64 ml-8 transition duration-300 ease-in-out transform hover:scale-105"
          transition:fade={{ duration: 2000 }}
        >
          Apply to Employee Credential
        </button>
      {/if}
    {/if}
  </div>
  <br />
  <br />
  <br />
  <!-- Employee applied creds -->
  {#await filteredCredentials}
    <p>Loading...</p>
  {:then data}
    {#if data.length > 0}
      <div>
        <h2 class="font-semibold m-3">Employee Credentials</h2>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Address</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {#each data as cred}
              <tr>
                <td>{cred.name}</td>
                <td>{cred.address}</td>
                {#if cred.status === 'Pending'}
                  <td class="flex">
                    <button
                      class="bg-green-500 px-4 py-2 text-white mr-4 rounded hover:bg-green-600"
                      id="accept"
                      on:click={(event) =>
                        updateStatus(event, cred, 'EmployeeCredentials')}
                      >Approve</button
                    >
                    <button
                      class="bg-red-500 px-4 py-2 text-white rounded hover:bg-red-600"
                      id="reject"
                      on:click={(event) =>
                        updateStatus(event, cred, 'EmployeeCredentials')}
                      >Reject</button
                    >
                  </td>
                {:else}
                  <td class="flex">
                    <span
                      class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800"
                    >
                      COMPLETED
                    </span>
                  </td>
                {/if}
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    {/if}
  {/await}
</main>

<style>
  table {
    /* border-collapse: collapse; */
    width: 100%;
    border-radius: 5px;
    outline: none;
  }

  th,
  td {
    /* border: 1px rgba(255, 62, 0, 0.2); */
    padding: 8px;
    text-align: left;
  }

  th {
    background-color: rgba(255, 62, 0, 0.2);
  }
  h2 {
    color: #ff3e00;
    text-transform: uppercase;
    font-size: 2rem;
    font-weight: 300;
    line-height: 1.1;
    margin: 2rem auto;
    max-width: 14rem;
    outline: none;
  }

  @media (min-width: 480px) {
    h2 {
      max-width: none;
      outline: none;
    }
  }
</style>
