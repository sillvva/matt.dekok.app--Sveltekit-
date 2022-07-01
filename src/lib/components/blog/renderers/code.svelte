<script lang="ts">
	import { isJSON } from '$lib/utils';
	import { onMount } from 'svelte';
	import Highlight, { HighlightSvelte } from 'svelte-highlight';
	import styles from 'svelte-highlight/styles/atom-one-dark';

	export let lang: string;
	export let text: string;

	$: language = lang.replace(/^([^ ]+).*$/i, '$1');
	$: filename = lang.replace(/^[^ ]+ \[([^\]]+)\].*$/i, '$1');
	$: props = isJSON(text) ? JSON.parse(text) : {};

	let CustomEmbed: any;
	let highlight: any;

	onMount(async () => {
		if (language == 'codepen')
			CustomEmbed = await import('$lib/components/blog/renderers/codepen.svelte').then(
				(c) => c.default
			);
		if (language == 'sveltecomponent')
			CustomEmbed = await import('$lib/components/blog/renderers/component.svelte').then(
				(c) => c.default
			);
		if (language == 'typescript' || language == 'ts')
			highlight = await import('svelte-highlight/languages/typescript').then((c) => c.default);
		else if (language == 'javascript' || language == 'js')
			highlight = await import('svelte-highlight/languages/javascript').then((c) => c.default);
		else if (language == 'json')
			highlight = await import('svelte-highlight/languages/json').then((c) => c.default);
		else if (language == 'css')
			highlight = await import('svelte-highlight/languages/css').then((c) => c.default);
		else if (language == 'scss')
			highlight = await import('svelte-highlight/languages/scss').then((c) => c.default);
		else if (language == 'yaml' || language == 'yml')
			highlight = await import('svelte-highlight/languages/yaml').then((c) => c.default);
		else if (language == 'markdown')
			highlight = await import('svelte-highlight/languages/markdown').then((c) => c.default);
		else if (language == 'bash')
			highlight = await import('svelte-highlight/languages/bash').then((c) => c.default);
	});
</script>

<svelte:head>
	{@html styles}
</svelte:head>

{#if language === 'codepen' || language === 'sveltecomponent'}
	<svelte:component this={CustomEmbed} {...props} />
{:else if language == 'svelte' || language == 'html' || language == 'env'}
	<div class="code">
		{#if filename}<span class="filename">{filename}</span>{/if}
		<HighlightSvelte code={text} />
	</div>
{:else if highlight}
	<div class="code">
		{#if filename}<span class="filename">{filename}</span>{/if}
		<Highlight language={highlight} code={text} />
	</div>
{:else}
	<pre class={language}>
		{#if filename}<span class="filename">{filename}</span>{/if}
		<code>
			{text.trim()}
		</code>
	</pre>
{/if}

<style lang="scss">
	pre,
	.code {
		@apply flex flex-col gap-2 text-sm mb-4 pt-2 md:p-2 pb-0 bg-gray-800 rounded-lg;
		> span.filename {
			@apply self-end max-w-fit top-4 right-4 p-1 px-2 mr-2 md:mr-0 rounded-sm bg-gray-700 text-white;
		}
		:global(code) {
			@apply flex-1 bg-gray-900 p-4 overflow-x-auto rounded-md text-white;
			tab-size: 0 !important;
			:global(*) {
				font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono',
					'Courier New', monospace;
			}
		}
	}
</style>
