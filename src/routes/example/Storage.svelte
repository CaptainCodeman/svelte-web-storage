<script lang="ts">
	import { web_storage } from 'svelte-web-storage'

  export let persist: boolean

  $: store = web_storage('settings', {
    range: 50,
    toggle: false,
    select: '',
  }, persist)
</script>

<pre>{JSON.stringify($store, null, 2)}</pre>

<input type="range" bind:value={$store.range} />
<input type="checkbox" bind:checked={$store.toggle} />
<select bind:value={$store.select}>
  <option value=""></option>
  <option value="CA">Canada</option>
  <option value="UK">United Kingdom</option>
  <option value="US">United States</option>
</select>
