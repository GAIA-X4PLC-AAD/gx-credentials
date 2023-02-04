<script lang="ts">
  import { BasePage } from 'components';
  import { onMount } from 'svelte';
  import {
    collection,
    getDocs,
    getDoc,
    doc,
    updateDoc,
  } from 'firebase/firestore/lite';
  import { db } from 'src/Firebase';
  import { fade, scale } from 'svelte/transition';
  import { flip } from 'svelte/animate';

  let loading = false;
  let requestData = null;
  onMount(async () => {
    loading = true;
    const requestsCol = collection(db, 'CompanyCredentials');
    const requestSnapshot = await getDocs(requestsCol);
    requestData = requestSnapshot.docs.map((doc) => doc.data());
    loading = false;
  });
  $: console.log('AA: ', requestData);

  const updateStatus = async (event, info) => {
    const docRef = doc(
      db,
      'CompanyCredentials',
      info.credentialSubject.id.split(/[: ]+/).pop()
    );
    if (docRef) {
      if (event.target.id === 'accept') {
        await updateDoc(docRef, { status: 'Approved' });
      }
      if (event.target.id === 'reject') {
        await updateDoc(docRef, { status: 'Rejected' });
      }
      console.log('infoDID: ', info.DID);
      const updatedData = requestData.filter(
        (element) => element.credentialSubject.id !== info.credentialSubject.id
      );
      requestData = updatedData;
    }
  };
  $: console.log('requestData: ', requestData);
</script>

<BasePage class="main flex items-center h-screen">
  <div class="flex flex-col">
    <div class="flex justify-center w-screen">
      <div class="text-5xl font-bold text-center mb-12">
        Requests for VC approval
      </div>
    </div>
    <!-- </div> -->

    <div class="w-full flex justify-center">
      <div class="w-3/4 overflow-x-auto rounded-lg">
        <table
          class="w-full text-sm text-left text-gray-500 dark:text-gray-400 shadow-lg"
        >
          <thead
            class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400"
          >
            <tr>
              <th scope="col" class="py-3 px-6 overflow-x-auto min-w-1/4">
                DID
              </th>
              <th scope="col" class="py-3 px-6"> Description </th>
              <th scope="col" class="py-3 px-6"> Alias </th>
              <th scope="col" class="py-3 px-6"> Action </th>
            </tr>
          </thead>
          <tbody>
            {#each requestData || [] as info, i (info)}
              <tr
                class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600"
              >
                <th
                  scope="row"
                  class="py-4 px-4 font-medium text-gray-900 dark:text-white break-all"
                >
                  {info.credentialSubject.id}
                </th>
                <td class="py-4 px-6 break-all">
                  {info.credentialSubject.description}
                </td>
                <td class="py-4 px-6">
                  {info.credentialSubject.alias}
                </td>
                <td class="flex items-center py-4 px-6 space-x-3">
                  <div
                    id="accept"
                    type="button"
                    class="text-green-600 font-bold cursor-pointer"
                    on:click={(event) => updateStatus(event, info)}
                  >
                    Approve
                  </div>
                  <div
                    id="reject"
                    type="button"
                    class="text-red-600 font-bold cursor-pointer"
                    on:click={(event) => updateStatus(event, info)}
                  >
                    Reject
                  </div>
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    </div>
  </div></BasePage
>
