<script>
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
</script>

<nav
	class="flex items-center justify-between border-b border-(--color-text-secondary)/20 py-4 dark:border-(--color-text-secondary-dark)/20"
>
	<h2>
		<a
			href={resolve('/')}
			class="font-semibold text-(--color-text-primary) dark:text-(--color-text-primary-dark)"
			>stowell<span class="text-(--color-primary)">.</span>dev</a
		>
	</h2>
	<div class="flex gap-2 md:gap-4">
		<a
			href={resolve('/projects')}
			class="text-xl {page.url.pathname.startsWith('/projects')
				? 'text-(--color-primary)'
				: 'text-(--color-text-primary) dark:text-(--color-text-primary-dark)'}">Projects</a
		>
		<a
			href={resolve('/blog')}
			class="text-xl {page.url.pathname.startsWith('/blog')
				? 'text-(--color-primary)'
				: 'text-(--color-text-primary) dark:text-(--color-text-primary-dark)'}">Blog</a
		>
	</div>
</nav>
