<script lang="ts">
	/**
	 * BitField - A bit-field diagram component for visualizing
	 * instruction encodings, register layouts, etc.
	 *
	 * Each field can either show a label (merged cell) or individual bit values.
	 *
	 * Usage in mdsvex:
	 *   <script>
	 *     import BitField from '$lib/components/BitField.svelte';
	 *   <\/script>
	 *
	 *   <!-- Label mode: merged cells with names -->
	 *   <BitField totalBits={16} fields={[
	 *     { bits: [15, 8], name: "opcode" },
	 *     { bits: [7, 6], name: "mod", description: "addressing mode" },
	 *     { bits: [5, 3], name: "reg", description: "register" },
	 *     { bits: [2, 0], name: "r/m", description: "register or memory" },
	 *   ]} />
	 *
	 *   <!-- Value mode: individual bit values in a merged cell -->
	 *   <BitField totalBits={16} fields={[
	 *     { bits: [15, 8], name: "0x89", description: "opcode" },
	 *     { bits: [7, 6], values: [1, 1], description: "mod (register)" },
	 *     { bits: [5, 3], values: [0, 0, 1], description: "reg (ecx)" },
	 *     { bits: [2, 0], values: [0, 0, 0], description: "r/m (eax)" },
	 *   ]} />
	 */

	interface Field {
		/** [highBit, lowBit] inclusive range, e.g. [15, 8] */
		bits: [number, number];
		/** Label shown inside a merged cell (used when no values provided) */
		name?: string;
		/** Optional description shown below the field */
		description?: string;
		/** Individual bit values, MSB first. Displayed evenly spaced inside a single merged cell. */
		values?: (0 | 1)[];
	}

	let {
		totalBits = 16,
		fields = []
	}: {
		totalBits?: number;
		fields: Field[];
	} = $props();

	const sortedFields = $derived([...fields].sort((a, b) => b.bits[0] - a.bits[0]));
	const hasDescriptions = $derived(sortedFields.some((f) => f.description));

	function fieldSpan(f: Field): number {
		return f.bits[0] - f.bits[1] + 1;
	}

	/** 0-based grid column offset from the left */
	function colStart(f: Field): number {
		return totalBits - f.bits[0];
	}

	function rangeLabel(f: Field): string {
		if (f.bits[0] === f.bits[1]) return `${f.bits[0]}`;
		return `${f.bits[0]}\u2013${f.bits[1]}`;
	}
</script>

<figure class="bitfield not-prose my-6 w-full overflow-x-auto">
	<div
		class="bf-grid"
		style="grid-template-columns: repeat({totalBits}, 1fr); min-width: {totalBits * 1.75}rem;"
	>
		<!-- Row 1: Bit indicators -->
		{#each sortedFields as field}
			{@const span = fieldSpan(field)}
			{@const col = colStart(field)}
			{#if field.values}
				<!-- Individual bit numbers above value fields -->
				{#each field.values as _, i}
					<div class="bf-bit-label" style="grid-row: 1; grid-column: {col + i};">
						{field.bits[0] - i}
					</div>
				{/each}
			{:else}
				<!-- Range label above label fields -->
				<div class="bf-bit-label" style="grid-row: 1; grid-column: {col} / span {span};">
					{rangeLabel(field)}
				</div>
			{/if}
		{/each}

		<!-- Row 2: Field cells (always merged per field) -->
		{#each sortedFields as field, idx}
			{@const span = fieldSpan(field)}
			{@const col = colStart(field)}
			{@const isFirst = idx === 0}
			{@const isLast = idx === sortedFields.length - 1}
			<div
				class="bf-cell"
				class:bf-first={isFirst}
				class:bf-last={isLast}
				style="grid-row: 2; grid-column: {col} / span {span};"
			>
				{#if field.values}
					<!-- Evenly spaced bit values inside merged cell -->
					<span class="bf-values">
						{#each field.values as val}
							<span class="bf-val">{val}</span>
						{/each}
					</span>
				{:else}
					<span class="bf-name">{field.name ?? ''}</span>
				{/if}
			</div>
		{/each}

		<!-- Row 3: Descriptions -->
		{#if hasDescriptions}
			{#each sortedFields as field}
				{@const span = fieldSpan(field)}
				{@const col = colStart(field)}
				<div class="bf-desc" style="grid-row: 3; grid-column: {col} / span {span};">
					{field.description ?? ''}
				</div>
			{/each}
		{/if}
	</div>
</figure>

<style>
	.bitfield {
		font-family:
			ui-monospace, 'SFMono-Regular', 'SF Mono', Menlo, Consolas, 'Liberation Mono', monospace;
		font-size: 0.8rem;
		line-height: 1;
	}

	.bf-grid {
		display: grid;
		width: 100%;
	}

	/* ── Bit number labels ── */

	.bf-bit-label {
		text-align: center;
		padding: 0.15rem 0 0.3rem;
		font-size: 0.65rem;
		color: var(--color-zinc-500);
		user-select: none;
	}

	@media (prefers-color-scheme: dark) {
		.bf-bit-label {
			color: var(--color-zinc-400);
		}
	}

	/* ── Field cells ── */

	.bf-cell {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 0.5rem 0.25rem;
		min-height: 2.5rem;
		text-align: center;
		font-weight: 600;
		white-space: nowrap;

		border: 1px solid var(--color-zinc-400);
		border-left-width: 0;
		color: var(--color-zinc-900);
		background: transparent;
	}

	@media (prefers-color-scheme: dark) {
		.bf-cell {
			border-color: var(--color-zinc-500);
			color: var(--color-zinc-100);
		}
	}

	/* First cell gets left border + rounded left corners */
	.bf-cell.bf-first {
		border-left-width: 1px;
		border-top-left-radius: 0.25rem;
		border-bottom-left-radius: 0.25rem;
	}

	/* Last cell gets rounded right corners */
	.bf-cell.bf-last {
		border-top-right-radius: 0.25rem;
		border-bottom-right-radius: 0.25rem;
	}

	/* ── Label inside cell ── */

	.bf-name {
		white-space: nowrap;
	}

	/* ── Bit values inside cell ── */

	.bf-values {
		display: flex;
		justify-content: space-evenly;
		width: 100%;
		font-variant-numeric: tabular-nums;
	}

	.bf-val {
		flex: 1;
		text-align: center;
	}

	/* ── Descriptions ── */

	.bf-desc {
		text-align: center;
		padding: 0.3rem 0.1rem 0;
		font-size: 0.65rem;
		color: var(--color-zinc-500);
		line-height: 1.3;
		min-height: 0.75rem;
	}

	@media (prefers-color-scheme: dark) {
		.bf-desc {
			color: var(--color-zinc-400);
		}
	}
</style>
