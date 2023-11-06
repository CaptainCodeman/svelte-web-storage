<script lang="ts">
	import Storage from './Storage.svelte'

  let show = false
  let persist = true
</script>

<button on:click={() => show = !show}>{show ? 'Hide' : 'Show'}</button>
<input type="checkbox" bind:checked={persist}>

{#if show}
  <Storage {persist} />
{/if}
