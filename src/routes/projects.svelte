<script lang="ts">
	import { pageProps } from '$lib/store';
	import GalleryItem from '$lib/components/gallery/item.svelte';
	import type { Project } from './projects';

	$pageProps = {
		title: 'Projects',
		bodyClass: 'page-body',
		menu: true
	};

	export let projects: Project[] = [];
</script>

<div class="flex flex-wrap justify-center lg:mt-0 pb-4 w-full">
	<div class="p-0 md:p-2 basis-full 2xl:basis-11/12">
		<div class="projects">
			{#each projects as project}
				<div class="project">
					<GalleryItem
						image={project.image}
						title={project.title}
						subtitle={project.subtitle}
						description={project.description}
						link={project.link}
					/>
				</div>
			{/each}
		</div>
	</div>
</div>

<style lang="scss">
	.projects {
		@apply flex flex-wrap -m-2 justify-center md:justify-start;
	}
	.project {
		@apply p-1 px-0 sm:p-3 basis-full sm:basis-9/12 md:basis-6/12 xl:basis-4/12 aspect-video;
	}
</style>
