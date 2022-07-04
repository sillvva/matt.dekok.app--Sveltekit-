<script lang="ts">
	import { session } from '$app/stores';
	import { isJSON } from '$lib/utils';
	import { onMount } from 'svelte';
	import stylesDark from 'svelte-highlight/styles/atom-one-dark';
	import stylesLight from 'svelte-highlight/styles/atom-one-light';

	export let lang: string;
	export let text: string;

	$: language = lang.replace(/^ *([^ ]+).*/, '$1');
	$: filename = lang.replace(new RegExp(`^ *${language} ?`), '').replace(/^\[([^\]]+)\].*$/i, '$1');
	$: props = isJSON(text) ? JSON.parse(text) : {};

	let CustomEmbed: any;
	let highlight: any;
	let SyntaxHighlighter: any;

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
		else if (language == 'svelte' || language == 'html' || language == 'env')
			SyntaxHighlighter = await import('svelte-highlight').then((c) => c.HighlightSvelte);
		if (highlight && !SyntaxHighlighter)
			SyntaxHighlighter = await import('svelte-highlight').then((c) => c.default);
	});
</script>

<svelte:head>
	{#if $session.theme == 'light'}
		{@html stylesLight}
	{:else}
		{@html stylesDark}
	{/if}
</svelte:head>

{#if CustomEmbed}
	<svelte:component this={CustomEmbed} {...props} />
{:else if SyntaxHighlighter}
	<div class="code">
		{#if filename}<span class="filename">{filename}</span>{/if}
		<svelte:component this={SyntaxHighlighter} language={highlight} code={text} />
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
		@apply flex flex-col gap-2 text-sm mb-4 pt-2 md:p-2 pb-0 rounded-lg;
		@apply bg-[color:var(--codePre)] transition-[background-color] duration-500;
		> span.filename {
			@apply self-end max-w-[calc(100%-1rem)] md:max-w-fit overflow-hidden top-4 right-4 p-1 px-2 mx-2 md:mx-0 rounded-sm;
			@apply bg-[color:var(--codeFile)] transition-[background-color] duration-500;
		}
		:global(code) {
			@apply flex-1 bg-[color:var(--code)] p-4 overflow-x-auto rounded-md transition-[background-color] duration-500;
			tab-size: 0 !important;
			:global(*) {
				font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono',
					'Courier New', monospace;
			}
		}
	}
</style>
