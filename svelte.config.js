import { mdsvex } from 'mdsvex';
import remarkMath from 'remark-math';
import adapter from '@sveltejs/adapter-static';

import rehypeKatexSvelte from 'rehype-katex-svelte';
import rehypeExternalLinks from 'rehype-external-links';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { createHighlighter } from 'shiki';

const __dirname = dirname(fileURLToPath(import.meta.url));

const highlighter = await createHighlighter({
	themes: ['dark-plus', 'light-plus'],
	langs: ['asm']
});

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: { adapter: adapter() },
	preprocess: [
		mdsvex({
			extensions: ['.md'],

			layout: {
				blog: join(__dirname, 'src/lib/layouts/Blog.svelte')
			},

			highlight: {
				highlighter(code, lang) {
					const html = highlighter.codeToHtml(code, {
						lang: lang || 'text',
						themes: {
							light: 'light-plus',
							dark: 'dark-plus'
						}
					});
					return `{@html ${JSON.stringify(html)}}`;
				}
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
