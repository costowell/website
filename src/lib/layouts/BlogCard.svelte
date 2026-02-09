<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';

	const { id, title, date, summary } = $props();
	const d = $derived(new Date(date));

	let month = $derived((d.getMonth() + 1).toString().padStart(2, '0'));
	let day = $derived((d.getDate() + 1).toString().padStart(2, '0'));
	const onclick = () => {
		goto(resolve(`/blog/${d.getFullYear()}/${month}/${day}/${id}`));
	};
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
		{d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
	</p>
	{#if summary}
		<p class="mt-2 text-sm text-(--color-text-secondary) dark:text-(--color-text-secondary-dark)">
			{summary}
		</p>
	{/if}
</button>
