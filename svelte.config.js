import { mdsvex } from 'mdsvex';
import remarkMath from 'remark-math';
import adapter from '@sveltejs/adapter-static';

import rehypeKatexSvelte from 'rehype-katex-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: { adapter: adapter() },
	preprocess: [
		mdsvex({
			extensions: ['.md'],

			remarkPlugins: [remarkMath],
			rehypePlugins: [rehypeKatexSvelte]
		})
	],
	extensions: ['.svelte', '.svx', '.md']
};

export default config;
