<script>
	import { Icon } from 'svelte-icons-pack';
	import { FaBrandsGithub, FaBrandsLinkedin, FaSolidEnvelope } from 'svelte-icons-pack/fa';
	import SiteMeta from '$lib/components/SiteMeta.svelte';
</script>

<SiteMeta />

<div class="py-8 md:py-12">
	<div class="rounded-lg">
		<div
			class="flex flex-col-reverse items-center justify-between gap-8 md:flex-row md:items-start"
		>
			<div class="flex flex-col items-center gap-4 md:items-start">
				<h1
					class="text-center text-4xl font-bold text-(--color-text-primary) md:text-left md:text-5xl dark:text-(--color-text-primary-dark)"
				>
					Hi, I'm Cole!
				</h1>
				<p
					class="max-w-lg text-center text-lg text-(--color-text-secondary) md:text-left dark:text-(--color-text-secondary-dark)"
				>
					I explore programming languages, mathematics, and low-level engineering. I spend a lot of
					time helping out at <a href="https://csh.rit.edu/">CSH</a> as a Sysadmin and Executive Board
					member. When I'm not doing something with a computer, I like to lift weights and run.
				</p>
				<div class="flex gap-4">
					<a
						href="https://github.com/costowell"
						target="_blank"
						rel="noopener noreferrer"
						class="text-(--color-text-primary) hover:text-(--color-primary) dark:text-(--color-text-primary-dark)"
					>
						<Icon src={FaBrandsGithub} size="28" />
					</a>
					<a
						href="https://linkedin.com/in/costowell"
						target="_blank"
						rel="noopener noreferrer"
						class="text-(--color-text-primary) hover:text-(--color-primary) dark:text-(--color-text-primary-dark)"
					>
						<Icon src={FaBrandsLinkedin} size="28" />
					</a>
					<a
						href="mailto:cole@stowell.pro"
						class="text-(--color-text-primary) hover:text-(--color-primary) dark:text-(--color-text-primary-dark)"
					>
						<Icon src={FaSolidEnvelope} size="28" />
					</a>
				</div>
			</div>
			<img
				src="/images/avatar.png"
				alt="my face barely visible in a ball pit"
				class="h-32 w-32 rounded-full border-4 border-(--color-primary) object-cover shadow-lg md:h-40 md:w-40"
			/>
		</div>
	</div>
</div>
