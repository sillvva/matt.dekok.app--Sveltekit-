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

{#if language === "codepen"}
	<CodePenEmbed {...props} />
{:else if language === "sveltecomponent"}
	<ComponentEmbed {...props} />
{:else}
<pre class={language}>
	{#if filename}<span class="filename">{filename}</span>{/if}
  <code class={filename ? 'mt-2' : ''}>{text}</code>
</pre>
{/if}

<!-- For styles, see ./src/misc.scss -->