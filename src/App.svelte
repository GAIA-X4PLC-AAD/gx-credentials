<script lang="ts">
  import { Router, Route } from 'svelte-navigator';
  import { Input, Home } from './routes';
  import './app.css';
</script>

<Router>
  <Route path="/">
    <Home />
  </Route>
  <Route path="/input">
    <Input />
  </Route>
</Router>

<style lang="postcss">
</style>
