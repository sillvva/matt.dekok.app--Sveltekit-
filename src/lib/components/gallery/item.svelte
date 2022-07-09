<script lang="ts">
import Wrapper from "./wrapper.svelte";
import Image from "$lib/components/common/image.svelte";

export let link: string = "";
export let image: string;
export let title: string;
export let subtitle: string = "";
export let description: string = "";
</script>

<Wrapper {link}>
  <Image src={image} alt={title} container="m-2 block" />
  <div class="cover">
    <h3>{title}</h3>
    {#if subtitle}<h4>{subtitle}</h4>{/if}
    {#if description}<div>{description}</div>{/if}
  </div>
</Wrapper>

<style lang="scss">
.cover {
  @apply absolute inset-0 m-2 p-2 flex flex-col justify-end;
  background: rgba(255, 255, 255, 0.01);
  background: -moz-linear-gradient(top, rgba(255, 255, 255, 0.01) 40%, black 100%);
  background: -webkit-gradient(
    left top,
    left bottom,
    color-stop(40%, rgba(255, 255, 255, 0.01)),
    color-stop(100%, black)
  );
  background: -webkit-linear-gradient(top, rgba(255, 255, 255, 0.01) 40%, black 100%);
  background: -o-linear-gradient(top, rgba(255, 255, 255, 0.01) 40%, black 100%);
  background: -ms-linear-gradient(top, rgba(255, 255, 255, 0.01) 40%, black 100%);
  background: linear-gradient(to bottom, rgba(255, 255, 255, 0.01) 40%, black 100%);
  * {
    @apply text-theme-button;
    filter: drop-shadow(1px 1px 1px black);
  }
  h3 {
    @apply text-lg font-medium my-0;
    line-height: 1.5rem;
    filter: drop-shadow(1px 1px 1px black);
  }
  h4 {
    @apply text-base font-light m-0;
    line-height: 1.3rem;
    filter: drop-shadow(1px 1px 1px black);
  }
  div {
    @apply text-sm font-light mt-1;
    filter: drop-shadow(1px 1px 1px black);
  }
}
</style>
