<script lang="ts">
	import ProjectCard from '$lib/components/ProjectCard.svelte';
	import projects from '../../../content/projects.json';
</script>

<div class="grid gap-4 py-8 sm:grid-cols-2">
	{#each projects as project (project.title)}
		<ProjectCard
			title={project.title}
			tagline={project.tagline}
			description={project.description}
			link={project.link}
			resources={project.resources}
		/>
	{/each}
</div>
