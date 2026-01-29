<script lang="ts">
	import AnimatedBackground from '$lib/components/AnimatedBackground.svelte';
	import { Card } from 'flowbite-svelte';
	import {
		BriefcaseSolid,
		ChartPieSolid,
		NewspaperSolid,
		ProfileCardSolid,
		GithubSolid,
		LinkedinSolid,
		EnvelopeSolid
	} from 'flowbite-svelte-icons';
</script>

<AnimatedBackground />

<div class="absolute inset-0 z-30 flex items-center justify-center">
	<Card class="w-full max-w-md border-gray-700 bg-gray-900/80 backdrop-blur-sm sm:max-w-xl">
		<div class="flex flex-col sm:flex-row">
			<nav class="border-b border-gray-700 p-3 sm:border-r sm:border-b-0 sm:p-3">
				<ul class="flex flex-row flex-wrap justify-center gap-2 sm:flex-col sm:gap-2">
					<li>
						<a
							href="/projects"
							class="flex items-center gap-2 rounded px-3 py-2 text-sm text-gray-400 hover:bg-gray-700/50 hover:text-white sm:gap-4 sm:px-4 sm:py-3 sm:text-lg"
						>
							<BriefcaseSolid class="h-5 w-5 sm:h-6 sm:w-6" />
							<span>Projects</span>
						</a>
					</li>
					<li>
						<a
							href="/status"
							class="flex items-center gap-2 rounded px-3 py-2 text-sm text-gray-400 hover:bg-gray-700/50 hover:text-white sm:gap-4 sm:px-4 sm:py-3 sm:text-lg"
						>
							<ChartPieSolid class="h-5 w-5 sm:h-6 sm:w-6" />
							<span>Status</span>
						</a>
					</li>
					<li>
						<a
							href="/blog"
							class="flex items-center gap-2 rounded px-3 py-2 text-sm text-gray-400 hover:bg-gray-700/50 hover:text-white sm:gap-4 sm:px-4 sm:py-3 sm:text-lg"
						>
							<NewspaperSolid class="h-5 w-5 sm:h-6 sm:w-6" />
							<span>Blog</span>
						</a>
					</li>
					<li>
						<a
							href="/about"
							class="flex items-center gap-2 rounded px-3 py-2 text-sm text-gray-400 hover:bg-gray-700/50 hover:text-white sm:gap-4 sm:px-4 sm:py-3 sm:text-lg"
						>
							<ProfileCardSolid class="h-5 w-5 sm:h-6 sm:w-6" />
							<span>About</span>
						</a>
					</li>
				</ul>
			</nav>

			<div class="flex flex-col gap-6 p-6">
				<div class="flex flex-col items-center gap-4 sm:flex-row sm:gap-6">
					<img
						src="/images/avatar2.png"
						alt="Avatar"
						class="aspect-square w-24 rounded-full object-cover ring-4 ring-sky-500/50 sm:w-28"
					/>
					<div class="flex flex-col items-center gap-3 sm:items-start">
						<span class="text-xl font-semibold text-white sm:text-2xl">Cole Stowell</span>
						<div class="flex gap-4">
							<a
								href="https://github.com/costowell"
								target="_blank"
								rel="noopener noreferrer"
								class="text-gray-400 transition-colors hover:text-white"
							>
								<GithubSolid class="h-6 w-6" />
							</a>
							<a
								href="https://linkedin.com/in/costowell"
								target="_blank"
								rel="noopener noreferrer"
								class="text-gray-400 transition-colors hover:text-white"
							>
								<LinkedinSolid class="h-6 w-6" />
							</a>
							<a
								href="mailto:cole@stowell.dev"
								class="text-gray-400 transition-colors hover:text-white"
							>
								<EnvelopeSolid class="h-6 w-6" />
							</a>
						</div>
					</div>
				</div>
				<blockquote class="border-l-2 border-sky-500/50 pl-4">
					<p class="text-gray-300 italic">
						"But if our sight stops there, let imagination go further; it will sooner tire of
						conceiving than nature of providing."
					</p>
					<footer class="mt-2 text-sm text-gray-500">— Blaise Pascal</footer>
				</blockquote>
			</div>
		</div>
	</Card>
</div>
