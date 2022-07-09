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
    "absolute inset-0",
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
      "absolute inset-0 border-none",
      "p-0 m-auto block [object-fit:var(--fit)] object-center",
      "w-0 h-0 min-w-full max-w-full min-h-full max-h-full",
      className
    ])} />
</span>

<style lang="scss">
@tailwind components;

@layer components {
  .cover-img {
    @apply -left-20 bottom-36 md:bottom-0 xs:-left-0 sm:-left-8 md:-left-28 lg:left-0;
    @apply [--gto:60%] md:[--gto:100%];
    &::after {
      content: "";
      @apply fixed z-0 left-0 right-0 bottom-0 h-[65vh] md:h-[20vh] lg:hidden;
      background-image: linear-gradient(transparent, rgb(var(--color-bg-body)) var(--gto));
    }
    img {
      @apply object-left lg:object-center;
    }
  }
}
</style>
