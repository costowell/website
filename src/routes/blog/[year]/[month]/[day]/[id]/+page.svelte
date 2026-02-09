<script lang="ts">
	import { page } from '$app/stores';
	const { year, month, day, id } = $page.params;
</script>

{#await import(`/content/blog/${year}-${month}-${day}-${id}.md`) then post}
	<svelte:component this={post.default} card={false}></svelte:component>
{:catch}
	<h1 class="p-10 text-center">Post not found :(</h1>
{/await}
