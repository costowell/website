<script lang="ts">
	import SiteMeta from '$lib/components/SiteMeta.svelte';
	let { date, title, summary, children } = $props();
	const isoDate = $derived(date ? new Date(date).toISOString() : undefined);
</script>

<SiteMeta {title} description={summary} type="article" publishedTime={isoDate} />

<article class="py-8">
	<header class="mb-5">
		<h1 class="mb-2">{title}</h1>
		{#if date}
			<time class="text-sm text-(--color-text-secondary) dark:text-(--color-text-secondary-dark)">
				{new Date(date).toLocaleDateString('en-US', {
					year: 'numeric',
					month: 'short',
					day: 'numeric',
					timeZone: 'UTC'
				})}
			</time>
		{/if}
	</header>

	<div class="prose max-w-none dark:prose-invert prose-code:before:hidden prose-code:after:hidden">
		{@render children()}
	</div>
</article>
