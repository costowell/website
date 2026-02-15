<script lang="ts">
	import type { PageProps } from './$types';
	let { data }: PageProps = $props();
</script>

{#if data.found}
	<data.component card={false} />
{:else}
	<h1 class="p-10 text-center">Post not found :(</h1>
{/if}
