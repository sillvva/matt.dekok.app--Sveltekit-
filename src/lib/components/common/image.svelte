<script lang="ts">
import { conClasses } from "$lib/utils";

export let src = ``;
export let set: string[] = [];
export let sizes: number[] = [];
export let alt: string;
export let title: string | undefined = undefined;
export let lazy = true;
export let id = ``;
export let objectFit = `cover`;
export let noAspect = false;

let containerClass = "";
export { containerClass as container };
let className = "";
export { className as class };

$: srcset = set
  .map((s, i) => {
    return `${s} ${sizes[i]}w`;
  })
  .join(", ");

$: loading = lazy ? "lazy" : "eager";
</script>

<span
  class={conClasses([
    "transition-all duration-500 bg-none",
    "overflow-hidden w-[initial] h-[initial] p-0",
    "inset-0",
    !noAspect && "absolute",
    containerClass
  ])}
  style:--fit={objectFit}>
  <img
    {id}
    {src}
    {srcset}
    {title}
    {alt}
    {loading}
    class={conClasses([
      !noAspect && "absolute inset-0 w-0 h-0 min-w-full max-w-full min-h-full max-h-full",
      "p-0 m-auto block [object-fit:var(--fit)] object-center border-none",
      className
    ])} />
</span>
