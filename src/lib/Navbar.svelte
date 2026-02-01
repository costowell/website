<script>
	import { resolve } from '$app/paths';
</script>

<nav
	class="flex items-center justify-between border-b border-(--color-text-secondary)/20 py-4 dark:border-(--color-text-secondary-dark)/20"
>
	<h2>
		<a
			href={resolve('/')}
			class="font-semibold text-(--color-text-primary) dark:text-(--color-text-primary-dark)"
			>stowell.dev</a
		>
	</h2>
	<div class="flex gap-2 md:gap-4">
		<a
			href={resolve('/status')}
			class="text-base text-(--color-text-primary) md:text-xl dark:text-(--color-text-primary-dark)"
			>Status</a
		>
		<a
			href={resolve('/blog')}
			class="text-base text-(--color-text-primary) md:text-xl dark:text-(--color-text-primary-dark)"
			>Blog</a
		>
		<a
			href={resolve('/about')}
			class="text-base text-(--color-text-primary) md:text-xl dark:text-(--color-text-primary-dark)"
			>About</a
		>
	</div>
</nav>
