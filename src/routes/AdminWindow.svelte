<script>
  import { onMount } from 'svelte';
  import { db } from '../Firebase';
  import { collection, getDocs, doc, updateDoc } from 'firebase/firestore/lite';
  import { fade } from 'svelte/transition';
  import { generateCompanyCredential } from '../store';
  let companyCredentials = [];
  let employeeCredentials = [];
  import { userData } from '../store';

  const updateStatus = async (event, info, client) => {
    const docRef = doc(db, client, info.address);
    if (docRef) {
      if (event.target.id === 'accept') {
        await generateCompanyCredential(info);
        await updateDoc(docRef, { status: 'Approved' });
      }
      if (event.target.id === 'reject') {
        await updateDoc(docRef, { status: 'Rejected' });
      }
      client === 'CompanyCredentials'
        ? (companyCredentials = companyCredentials.filter(
            (element) => element.address !== info.address
          ))
        : (employeeCredentials = employeeCredentials.filter(
            (element) => element.address !== info.address
          ));
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
</script>

<main
  class="h-screen flex flex-col align-middle justify-center"
  transition:fade
>
  <div>
    <h3 class="font-semibold">Company Credential Applications</h3>
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Description</th>
          <th>URL</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {#each companyCredentials as cred}
          <tr transition:fade>
            <td>{cred.name}</td>
            <td>{cred.description}</td>
            <td>{cred.url}</td>
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
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
  <br />
  <br />
  <br />
  <!-- Employee credentials table starts here -->
  <div>
    <h3 class="font-semibold">Employee Credential Applications</h3>
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Description</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {#each employeeCredentials as cred}
          <tr>
            <td>{cred.name}</td>
            <td>{cred.company}</td>
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
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
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
  h3 {
    color: #ff3e00;
    text-transform: uppercase;
    font-size: 1rem;
    font-weight: 300;
    line-height: 1.1;
    margin: 2rem auto;
    max-width: 14rem;
    outline: none;
  }

  @media (min-width: 480px) {
    h3 {
      max-width: none;
      outline: none;
    }
  }
</style>
