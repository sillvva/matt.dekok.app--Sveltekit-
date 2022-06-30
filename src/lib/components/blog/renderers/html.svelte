<script lang="ts">
  import './html.scss';
	export let text: string;
	$: text = text.replace(/<pre>/g, `<pre class="html-codeblock">`);
</script>

{@html text}
