<script lang="ts">
	import { page } from '$app/stores';
	import Animatedbutton from '$lib/components/common/animated-button.svelte';

	type Item = {
		link: string;
		label: string;
		color?: string;
		hoverColor?: string;
		activeColor?: string;
		textColor?: string;
	};

	export let items: Item[];
	export let color: string = 'var(--color-text-link)';
	export let hoverColor: string = 'var(--color-bg-body)';
	export let activeColor: string = 'var(--color-bg-body)';
	export let textColor: string = 'var(--color-text-link)';
	export let itemClasses: string[] = ['button-5'];
</script>

{#each items as item (item.link)}
	<Animatedbutton
		link={item.link}
		color={item.color || color}
		{itemClasses}
		active={item.link === $page.url.pathname}
		activeColor={item.activeColor || activeColor}
		hoverColor={item.hoverColor || hoverColor}
		textColor={item.textColor || textColor}
	>
		{item.label}
	</Animatedbutton>
{/each}
