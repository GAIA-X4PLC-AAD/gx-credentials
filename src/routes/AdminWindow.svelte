<script>
  import { onMount } from 'svelte';
  import { db } from '../Firebase';
  import { collection, getDocs, doc, updateDoc } from 'firebase/firestore/lite';
  import { fade } from 'svelte/transition';
  import { generateCompanyCredential, userData } from '../store';
  let companyCredentials = [];

  const updateStatus = async (event, info, client) => {
    const docRef = doc(db, client, info.address);
    if (docRef) {
      if (event.target.id === 'accept') {
        await generateCompanyCredential(info);
        await updateDoc(docRef, { status: 'Approved' });
        companyCredentials.forEach((element) => {
          if (element.address === info.address) {
            element.status = 'Approved';
          }
        });
        companyCredentials = companyCredentials;
      }
      if (event.target.id === 'reject') {
        await updateDoc(docRef, { status: 'Rejected' });
        companyCredentials.forEach((element) => {
          if (element.address === info.address) {
            element.status = 'Rejected';
          }
        });
        companyCredentials = companyCredentials;
      }
    }
  };

  onMount(async () => {
    const companyCol = collection(db, 'CompanyCredentials');
    const companySnapshot = await getDocs(companyCol);
    companyCredentials = companySnapshot.docs.map((doc) => doc.data());
  });
  $: companyCredentials = companyCredentials;
</script>

<main class="h-screen flex flex-col align-middle justify-center">
  <div>
    <h2 class="font-semibold">Company Credential Applications</h2>
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Description</th>
          <th>GX-ID</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {#each companyCredentials as cred}
          <tr transition:fade>
            <td>{cred.name}</td>
            <td>{cred.description}</td>
            <td>{cred.gxId}</td>

            {#if cred.status === 'Pending'}
              <td class="flex">
                <button
                  class="bg-green-500 px-4 py-2 text-white mr-4 rounded hover:bg-green-600"
                  id="accept"
                  on:click={(event) =>
                    updateStatus(event, cred, 'CompanyCredentials')}
                  >Approve</button
                >
                <button
                  class="bg-red-500 px-4 py-2 text-white rounded hover:bg-red-600"
                  id="reject"
                  on:click={(event) =>
                    updateStatus(event, cred, 'CompanyCredentials')}
                  >Reject</button
                >
              </td>
            {:else}
              <td class="flex">
                <span
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800"
                >
                  PROCESSED
                </span>
              </td>
            {/if}
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
  <br />
  <br />
  <br />
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
