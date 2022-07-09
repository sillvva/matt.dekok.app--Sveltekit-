<script lang="ts">
import { conClasses } from "$lib/utils";

let className = "";
export { className as class };
</script>

<article
  class={conClasses(["shadow-xl ring-1 rounded-lg mb-4 ring-gray-900/5 overflow-hidden bg-theme-article", className])}>
  <slot />
</article>
