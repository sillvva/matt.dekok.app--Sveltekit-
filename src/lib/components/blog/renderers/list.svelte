<script lang="ts">
  export let ordered: boolean;
  export let start: number;
</script>

{#if ordered}
  <ol class="list-outside ml-4" {start}><slot></slot></ol>
{:else}
  <ul class="list-outside ml-4"><slot></slot></ul>
{/if}