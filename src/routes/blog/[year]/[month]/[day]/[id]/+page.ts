import type { BlogMetadata, MdModule } from '../../../../../../md.js';

const posts = import.meta.glob<MdModule<BlogMetadata>>('/content/blog/*.md', { eager: true });

export function entries() {
	return Object.values(posts).map(({ metadata }) => {
		const d = new Date(metadata.date);
		return {
			year: d.getUTCFullYear().toString(),
			month: (d.getUTCMonth() + 1).toString().padStart(2, '0'),
			day: d.getUTCDate().toString().padStart(2, '0'),
			id: metadata.id
		};
	});
}

export function load({ params }) {
	const { year, month, day, id } = params;
	const key = `/content/blog/${year}-${month}-${day}-${id}.md`;
	const post = posts[key];

	if (!post) {
		return { found: false as const };
	}

	return {
		found: true as const,
		component: post.default,
		metadata: post.metadata
	};
}
