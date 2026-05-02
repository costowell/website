<script lang="ts">
	import SiteMeta from '$lib/components/SiteMeta.svelte';
	import type { BlogMetadata } from '../../md';
	let { published, revised, title, summary, children }: BlogMetadata = $props();
	const publishedDate = $derived(new Date(published));
	const revisedDate = $derived(new Date(revised));
	const isoDate = $derived(published ? publishedDate.toISOString() : undefined);
	const fmt = (d: Date) =>
		d.toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric',
			timeZone: 'UTC'
		});
	const isRevised = $derived(publishedDate.valueOf() != revisedDate.valueOf());
</script>

<SiteMeta {title} description={summary} type="article" publishedTime={isoDate} />

<article class="py-8">
	<header class="mb-5">
		<h1 class="mb-2">{title}</h1>
		{#if published}
			<time class="text-sm text-(--color-text-secondary) dark:text-(--color-text-secondary-dark)">
				{fmt(publishedDate)}
				{#if isRevised}
					(Revised {fmt(revisedDate)})
				{/if}
			</time>
		{/if}
	</header>

	<div class="prose max-w-none dark:prose-invert prose-code:before:hidden prose-code:after:hidden">
		{@render children()}
	</div>
</article>
