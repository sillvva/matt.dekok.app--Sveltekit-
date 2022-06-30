<script lang="ts">
	export let text: string;
	$: text = text.replace(/<pre>/g, `<pre class="html-codeblock">`);
</script>

{@html text}

<style>
	:global(.html-codeblock) {
		@apply flex flex-col text-sm mb-4 pt-2 md:p-2 pb-0 bg-gray-800 rounded-lg;
	}
	:global(.html-codeblock code) {
		@apply flex-1 bg-gray-900 p-4 overflow-x-auto rounded-md text-white;
	}
</style>
