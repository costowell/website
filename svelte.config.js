import { mdsvex } from 'mdsvex';
import remarkMath from 'remark-math';
import adapter from '@sveltejs/adapter-static';

import rehypeKatexSvelte from 'rehype-katex-svelte';
import rehypeExternalLinks from 'rehype-external-links';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: { adapter: adapter() },
	preprocess: [
		mdsvex({
			extensions: ['.md'],

			layout: {
				blog: join(__dirname, 'src/lib/layouts/Blog.svelte')
			},

			remarkPlugins: [remarkMath],
			rehypePlugins: [
				rehypeKatexSvelte,
				[rehypeExternalLinks, { target: '_blank', rel: ['noopener', 'noreferrer'] }]
			]
		})
	],
	extensions: ['.svelte', '.svx', '.md']
};

export default config;
