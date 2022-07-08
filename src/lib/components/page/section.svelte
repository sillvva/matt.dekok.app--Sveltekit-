<script lang="ts">
	import { conClasses } from '$lib/utils';

	let className = '';
	export { className as class };
</script>

<section
	on:click
	class={conClasses(['p-5 section-border text-theme-base', 'last:border-b-0', className])}
>
	<slot />
</section>
