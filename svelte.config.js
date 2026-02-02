import { mdsvex } from 'mdsvex';
import remarkMath from 'remark-math';
import adapter from '@sveltejs/adapter-static';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import rehypeKatexSvelte from 'rehype-katex-svelte';

const __dirname = dirname(fileURLToPath(import.meta.url));

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: { adapter: adapter() },
	preprocess: [
		mdsvex({
			extensions: ['.md'],
			layout: {
				project: join(__dirname, 'src/lib/layouts/ProjectLayout.svelte')
			},
			remarkPlugins: [remarkMath],
			rehypePlugins: [rehypeKatexSvelte]
		})
	],
	extensions: ['.svelte', '.svx', '.md']
};

export default config;
