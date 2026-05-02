declare module '*.md' {
	import type { Component } from 'svelte';

	const component: Component;
	export default component;

	export const metadata: Record<string, unknown>;
}

export interface MdModule<T> {
	default: Component;
	metadata: T;
}

export interface BlogMetadata {
	id: string;
	title: string;
	published: string;
	revised: string;
	summary: string;
	layout: string;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	children: any;
}
