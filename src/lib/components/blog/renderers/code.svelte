<script lang="ts">
	import { isJSON } from '$lib/utils';

	import CodePenEmbed from './codepen.svelte';
	import ComponentEmbed from './component.svelte';

	export let lang: string;
	export let text: string;

	$: language = lang.replace(/^([^ ]+).*$/i, '$1');
	$: filename = lang.replace(/^[^ ]+ \[([^\]]+)\].*$/i, '$1');
	$: props = isJSON(text) ? JSON.parse(text) : {};
</script>

{#if language === 'codepen'}
	<CodePenEmbed {...props} />
{:else if language === 'sveltecomponent'}
	<ComponentEmbed {...props} />
{:else}
	<pre class={language}>
	{#if filename}<span class="filename">{filename}</span>{/if}
  <code class={filename ? 'mt-2' : ''}>{text}</code>
</pre>
{/if}

<style lang="scss">
	pre {
		@apply flex flex-col text-sm mb-4 pt-2 md:p-2 pb-0 bg-gray-800 rounded-lg;
		> span.filename {
			@apply self-end max-w-fit top-4 right-4 p-1 px-2 mr-2 md:mr-0 rounded-sm bg-gray-700 text-white;
		}
		> code {
			@apply flex-1 bg-gray-900 p-4 overflow-x-auto rounded-md text-white;
		}
	}
</style>
