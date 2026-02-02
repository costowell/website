<script lang="ts">
	import { Icon } from 'svelte-icons-pack';
	import { FaSolidArrowUpRightFromSquare } from 'svelte-icons-pack/fa';

	let {
		title,
		tagline,
		description,
		link,
		resources = []
	}: {
		title: string;
		tagline: string;
		description: string;
		link?: string;
		resources?: { label: string; url: string }[];
	} = $props();
</script>

<article
	class="rounded-lg border border-(--color-text-secondary)/20 bg-(--color-bg-surface) p-5 transition-all hover:border-(--color-primary)/50 hover:shadow-md dark:border-(--color-text-secondary-dark)/20 dark:bg-(--color-bg-surface-dark)"
>
	<h3 class="text-xl font-bold text-(--color-text-primary) dark:text-(--color-text-primary-dark)">
		{title}
	</h3>
	<p
		class="mt-1 text-sm text-(--color-text-secondary) italic dark:text-(--color-text-secondary-dark)"
	>
		{tagline}
	</p>
	<p class="mt-3 text-(--color-text-primary) dark:text-(--color-text-primary-dark)">
		{description}
	</p>

	<div class="mt-4 flex flex-wrap items-center gap-3">
		{#if link}
			<a
				href={link}
				target="_blank"
				rel="external noopener noreferrer"
				class="inline-flex items-center gap-1 text-sm text-(--color-primary) hover:text-(--color-primary-hover)"
			>
				View Project
				<Icon src={FaSolidArrowUpRightFromSquare} size="10" />
			</a>
		{/if}

		{#if resources.length > 0}
			<span class="text-(--color-text-secondary)/50 dark:text-(--color-text-secondary-dark)/50"
				>|</span
			>
			{#each resources as resource (resource.url)}
				<a
					href={resource.url}
					target="_blank"
					rel="external noopener noreferrer"
					class="inline-flex items-center gap-1 text-sm text-(--color-primary) hover:text-(--color-primary-hover)"
				>
					{resource.label}
					<Icon src={FaSolidArrowUpRightFromSquare} size="10" />
				</a>
			{/each}
		{/if}
	</div>
</article>
