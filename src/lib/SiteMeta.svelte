<script lang="ts">
	let {
		title = 'costowell',
		description = "costowell's list of ramblings and bodges",
		type = 'website',
		image = '/images/avatar.png',
		publishedTime
	}: {
		title?: string;
		description?: string;
		type?: string;
		image?: string;
		publishedTime?: string;
	} = $props();
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	<meta property="og:type" content={type} />
	<meta property="og:site_name" content="stowell.dev" />
	{#if image}
		<meta property="og:image" content={image} />
	{/if}
	{#if publishedTime}
		<meta property="article:published_time" content={publishedTime} />
	{/if}
	<meta name="twitter:card" content="summary" />
	<meta name="twitter:title" content={title} />
	<meta name="twitter:description" content={description} />
</svelte:head>
