<script lang="ts">
	import './layout.css';
	import 'katex/dist/katex.min.css';
	import favicon from '$lib/assets/favicon.svg';
	import '@fontsource/cooper-hewitt';
	import '@fontsource-variable/karla';
	import Navbar from '$lib/Navbar.svelte';
	let { children } = $props();
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>

<div
	class="bg-(--color-bg-base) text-(--color-text-primary) dark:bg-(--color-bg-base-dark) dark:text-(--color-text-primary-dark)"
>
	<div
		class="mx-auto min-h-screen max-w-3xl border-x border-(--color-text-secondary)/20 bg-(--color-bg-surface) px-6 dark:border-(--color-text-secondary-dark)/20 dark:bg-(--color-bg-surface-dark)"
	>
		<Navbar />
		<div class="px-2">
			{@render children()}
		</div>
	</div>
</div>
