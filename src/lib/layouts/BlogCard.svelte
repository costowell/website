<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import type { BlogMetadata } from '../../md';

	const { id, title, published, revised, summary }: BlogMetadata = $props();
	const publishedDate = $derived(new Date(published));
	const revisedDate = $derived(new Date(revised));

	const month = $derived((publishedDate.getUTCMonth() + 1).toString().padStart(2, '0'));
	const day = $derived(publishedDate.getUTCDate().toString().padStart(2, '0'));
	const onclick = () => {
		goto(resolve(`/blog/${publishedDate.getUTCFullYear()}/${month}/${day}/${id}`));
	};
	const fmt = (d: Date) =>
		d.toLocaleDateString('en-US', {
			month: 'short',
			day: 'numeric',
			year: 'numeric',
			timeZone: 'UTC'
		});
	const isRevised = $derived(publishedDate.valueOf() != revisedDate.valueOf());
</script>

<button
	class="cursor-pointer rounded-lg border border-(--color-text-secondary)/20 bg-(--color-bg-surface) p-5 text-left transition-all hover:border-(--color-primary)/50 hover:underline hover:shadow-md dark:border-(--color-text-secondary-dark)/20 dark:bg-(--color-bg-surface-dark)"
	{onclick}
>
	<h3 class="text-xl font-bold text-(--color-text-primary) dark:text-(--color-text-primary-dark)">
		{title}
	</h3>
	<p
		class="mt-1 text-sm text-(--color-text-secondary) italic dark:text-(--color-text-secondary-dark)"
	>
		{fmt(publishedDate)}
		{#if isRevised}
			(Revised {fmt(revisedDate)})
		{/if}
	</p>
	{#if summary}
		<p class="mt-2 text-sm text-(--color-text-secondary) dark:text-(--color-text-secondary-dark)">
			{summary}
		</p>
	{/if}
</button>
