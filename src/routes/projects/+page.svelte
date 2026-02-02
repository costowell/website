<script lang="ts">
	const projects = Object.values(import.meta.glob('/content/projects/*.md', { eager: true }));
</script>

{#each projects as project (project.metadata.title)} <div><project.default /></div> {/each}
