<script lang="ts">
  import { Router, Route } from 'svelte-navigator';
  import { Company, Home } from './routes';
  import './app.css';
  import Selection from './routes/Selection.svelte';
  import Employee from './routes/Employee.svelte';
  import AdminWindow from './routes/AdminWindow.svelte';
</script>

<main>
  <Router>
    <Route path="/">
      <Home />
    </Route>
    <Route path="/company">
      <Company />
    </Route>
    <Route path="/employee">
      <Employee />
    </Route>
    <Route path="/selection">
      <Selection />
    </Route>
    <Route path="/admin">
      <AdminWindow />
    </Route>
  </Router>
</main>

<style>
  :root {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
      Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  }

  main {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 1em;
    margin: 0 auto;
  }

  h1 {
    color: #ff3e00;
    text-transform: uppercase;
    font-size: 4rem;
    font-weight: 300;
    line-height: 1.1;
    margin: 2rem auto;
    max-width: 14rem;
  }

  @media (min-width: 480px) {
    h1 {
      max-width: none;
    }

    p {
      max-width: none;
    }
  }
</style>
