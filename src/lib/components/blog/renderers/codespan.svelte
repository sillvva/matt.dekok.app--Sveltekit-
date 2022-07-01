<script lang="ts">
	import { onMount } from 'svelte';

	onMount(() => {
		document.querySelectorAll('.codespan').forEach((el) => {
			el.innerHTML = el.innerHTML.replace(/^`*([^`]+)`*$/, '$1');
		});
	});
</script>

<code class="codespan"><slot /></code>

<style lang="scss">
	code {
		@apply px-1 mx-1 outline outline-1 rounded-sm bg-white/10;
	}
</style>
