<script>
	let { title, subtitle, github, children } = $props();
</script>

<article class="py-8 md:py-12">
	<header class="mb-8">
		<h1
			class="text-4xl font-bold text-(--color-text-primary) dark:text-(--color-text-primary-dark)"
		>
			{title}
		</h1>
		{#if subtitle}
			<p class="mt-2 text-lg text-(--color-text-secondary) dark:text-(--color-text-secondary-dark)">
				{subtitle}
			</p>
		{/if}
		{#if github}
			<a
				href={github}
				target="_blank"
				rel="noopener noreferrer external"
				class="mt-4 inline-flex items-center gap-2 text-(--color-primary) hover:text-(--color-primary-hover)"
			>
				View on GitHub
			</a>
		{/if}
	</header>
	<div class="prose max-w-none prose-zinc dark:prose-invert">
		{@render children()}
	</div>
</article>
