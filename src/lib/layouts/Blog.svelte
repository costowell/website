<script lang="ts">
	import BlogCard from './BlogCard.svelte';
	import BlogPost from './BlogPost.svelte';

	const { card = true, ...rest } = $props<{ card: boolean; [key: string]: unknown }>();
</script>

{#if card}
	<BlogCard {...rest} />
{:else}
	<BlogPost {...rest} />
{/if}
