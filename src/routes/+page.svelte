<script>
	import { Icon } from 'svelte-icons-pack';
	import { FaBrandsGithub, FaBrandsLinkedin, FaSolidEnvelope } from 'svelte-icons-pack/fa';
</script>

<div class="py-8 md:py-12">
	<div class="rounded-lg">
		<div class="flex flex-col items-start justify-between gap-8 md:flex-row">
			<div class="flex flex-col gap-4">
				<h1
					class="text-4xl font-bold text-(--color-text-primary) md:text-5xl dark:text-(--color-text-primary-dark)"
				>
					Hi, I'm Cole!
				</h1>
				<p
					class="max-w-lg text-lg text-(--color-text-secondary) dark:text-(--color-text-secondary-dark)"
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
				class="h-40 w-40 self-end rounded-full border-4 border-(--color-primary) object-cover shadow-lg md:self-start"
			/>
		</div>
	</div>
</div>
