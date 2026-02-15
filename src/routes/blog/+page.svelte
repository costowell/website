<script lang="ts">
	import SiteMeta from '$lib/SiteMeta.svelte';
	import type { BlogMetadata, MdModule } from '../../md';

	const posts: MdModule<BlogMetadata>[] = Object.values(
		import.meta.glob<MdModule<BlogMetadata>>('/content/blog/*.md', { eager: true })
	);
	posts.sort((a, b) => new Date(b.metadata.date).valueOf() - new Date(a.metadata.date).valueOf());
</script>

<SiteMeta title="costowell blog" description="the ramblings" />

<div class="my-5 flex flex-col gap-5">
	{#each posts as post (post.metadata.id)}
		<div class="contents w-auto">
			<post.default card={true} />
		</div>
	{/each}
</div>
