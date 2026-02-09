<script lang="ts">
	let { date, title, summary, children } = $props();
	const isoDate = $derived(date ? new Date(date).toISOString() : undefined);
</script>

<svelte:head>
	<title>{title}</title>
	<meta property="og:title" content={title} />
	<meta property="og:type" content="article" />
	{#if isoDate}
		<meta property="article:published_time" content={isoDate} />
	{/if}
	{#if summary}
		<meta name="description" content={summary} />
		<meta property="og:description" content={summary} />
		<meta name="twitter:description" content={summary} />
	{/if}
	<meta name="twitter:card" content="summary" />
	<meta name="twitter:title" content={title} />
</svelte:head>

<article class="py-8">
	<header class="mb-8">
		<h1 class="mb-2">{title}</h1>
		{#if date}
			<time class="text-sm text-(--color-text-secondary) dark:text-(--color-text-secondary-dark)">
				{new Date(date).toLocaleDateString('en-US', {
					year: 'numeric',
					month: 'short',
					day: 'numeric'
				})}
			</time>
		{/if}
	</header>

	<div class="prose max-w-none dark:prose-invert prose-code:before:hidden prose-code:after:hidden">
		{@render children()}
	</div>
</article>
