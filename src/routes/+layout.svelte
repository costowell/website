<script lang="ts">
	import './layout.css';
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
		class="mx-auto min-h-screen max-w-3xl bg-(--color-bg-surface) px-4 dark:bg-(--color-bg-surface-dark)"
	>
		<Navbar />
		{@render children()}
	</div>
</div>
