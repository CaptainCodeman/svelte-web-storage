<script lang="ts">
	import { web_storage } from 'svelte-web-storage'

  export let persist: boolean

  $: store = web_storage('settings', 50, { persist })
</script>

<pre>{JSON.stringify($store, null, 2)}</pre>

<input type="range" bind:value={$store} />
